import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import pdfParse from "pdf-parse";
import { fromBuffer as convertPdfToPng } from "pdf2pic";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Opciones para pdf2pic
const pdf2picOptions = {
  format: "png",
  width: 1240,
  height: 1754,
  density: 150,
};

const s3Client = new S3Client({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCES_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // Configuración equivalente a s3ForcePathStyle
});

// Función para convertir PDF a imagen base64 y describirla
const convertAndDescribePDF = async (pdfBuffer, openai) => {
  const convert = convertPdfToPng(pdfBuffer);
  const pageResult = await convert(1, { responseType: "base64" });

  return await describeImage(pageResult.base64, openai);
};

const returnPrompt = (
  pdfTexts,
  profileSearch,
  skills,
  experience,
  language
) => {
  const assistantPrompt = `
Eres una asistente de recursos humanos que busca a profesionales. Tu labor va a ser revisar currículums y seleccionar candidatos conforme a lo que se te pida. Asegúrate de tener en cuenta habilidades técnicas, experiencia laboral y cualquier otra competencia relevante para el puesto.
  `;

  return `
${assistantPrompt}

Buscamos específicamente un perfil con las siguientes características:
- Puesto: ${profileSearch}
- Habilidades: ${skills}
- Experiencia: ${experience}

Por favor, revisa los currículums y selecciona aquellos que más se ajusten a estos criterios. Proporcióname el nombre del candidato, sus habilidades, su experiencia y un resumen general.

Descripciones de las imágenes de los currículums:
${pdfTexts.description}

Texto de los currículums:
${pdfTexts.text}

Dale un número de estrellas del 1 al 5 al candidato según su perfil.

Obten datos de contanto como correo y teléfono.
    
Responde en idioma ${language}.
  `;
};

// Función para extraer texto de un PDF
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extrayendo texto del PDF:", error);
    return "";
  }
};

// Función para describir la imagen utilizando GPT-4
const describeImage = async (base64Img, openai) => {
  const result = await generateText({
    model: openai,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe la imagen de perfil del curriculum.",
          },
          {
            type: "image",
            image: base64Img,
          },
        ],
      },
    ],
  });
  console.log("cl: result", result);
  return result.text;
};

// Procesar un PDF, extrayendo texto y descripción de imagen
const processPdf = async (file, openai) => {
  const pdfBuffer = await file.arrayBuffer();
  const text = await extractTextFromPDF(Buffer.from(pdfBuffer));
  const description = await convertAndDescribePDF(
    Buffer.from(pdfBuffer),
    openai
  );
  return { text, description };
};

export async function POST(request) {
  const formData = await request.formData();

  const files = formData.getAll("files");
  const profileSearch = formData.get("profileSearch");
  const skills = formData.get("skills");
  const experience = formData.get("experience");
  const language = formData.get("language");
  const openaiKey = formData.get("openaikey");
  const route = formData.get("route");
  const vacancyId = formData.get("vacancyId");

  const openaiApiKey = process.env.OPENAI_API_KEY || openaiKey;
  const openai = createOpenAI({ apiKey: openaiApiKey });
  const pdfFiles = files.filter((file) => file.type === "application/pdf");

  const fileContent = await pdfFiles[0].arrayBuffer();
  const fileName = pdfFiles[0].name;

  const params = {
    Bucket: process.env.BUCKET,
    Key: `${route}${fileName}`,
    Body: fileContent,
    ContentType: "application/pdf",
  };

  const supabase = createClient();

  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
        message: error.message,
      }),
      { status: 401 }
    );
  }

  try {
    // Sube el archivo a S3
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log(`Archivo subido con éxito a ${data.Location}`);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error subiendo archivo a S3",
        message: error.message,
      }),
      { status: 500 }
    );
  }

  const file = await processPdf(pdfFiles[0], openai("gpt-4-turbo"));
  console.log(
    "cl: prompt",
    returnPrompt(file, profileSearch, skills, experience, language)
  );
  // Generar objeto JSON usando OpenAI
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      candidate: z
        .object({
          name: z.string(),
          skills: z.array(z.string()),
          experience: z.array(z.string()),
          resume: z.string(),
          why: z.string(),
          isApproved: z.boolean(),
          stars: z.number(),
          contact: z.object({
            email: z.string(),
            phone: z.string(),
          }),
        })
        .optional()
        .nullable(),
    }),
    prompt: returnPrompt(file, profileSearch, skills, experience, language),
  });

  const { data, error: resumeError } = await supabase.from("resumes").insert([
    {
      s3_route: `${route}${fileName}`,
      vacancy_id: vacancyId,
      result: object.candidate,
    },
  ]);

  if (resumeError) {
    return new Response(
      JSON.stringify({
        error: "Error insertando en la base de datos",
        message: resumeError.message,
      }),
      { status: 500 }
    );
  }

  const { error } = await supabase
    .from("vacancies")
    .update({
      requirements: {
        profileSearch,
        skills,
        experience,
      },
    })
    .eq("id", vacancyId);

  return new Response(JSON.stringify(object), { status: 200 });
}
