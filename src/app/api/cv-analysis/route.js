import { createOpenAI } from "@ai-sdk/openai";
import { generateObject,generateText } from "ai";
import { any, string, z } from "zod";
import pdfParse from "pdf-parse";
import { fromBuffer as convertPdfToPng } from "pdf2pic";

const pdf2picOptions = {
  format: 'png',
  width: 2550,
  height: 3300,
  density: 330

};

export async function POST(request) {
  const formData = await request.formData();

  const files = formData.getAll("files");
  const profileSearch = formData.get("profileSearch");
  const skills = formData.get("skills");
  const experience = formData.get("experience");
  const language = formData.get("language");
  const openaiKey = formData.get("openaikey");

  const openaiApiKey = process.env.OPENAI_API_KEY || openaiKey;
  const openai = createOpenAI({ apiKey: openaiApiKey });

  // Filtrar archivos PDF
  const pdfFiles = files.filter((file) => file.type === "application/pdf");

  console.log(pdfFiles);

  // Función para extraer texto de un PDF
  const extractTextFromPDF = async (pdfBuffer) => {
    try {
      const data = await pdfParse(pdfBuffer);
      return data.text;
    } catch (error) {
      return "";
    }
  };

  // Función para describir la imagen utilizando GPT-4
  const describeImage = async (base64Img) => {
    const result = await generateText({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe the image in detail.' },
            {
              type: 'image',
              image: base64Img,
            },
          ],
        },
      ],
    });

    return result.choices[0].message.text;
  };

  // Función para convertir PDF a imagen base64 y describirla
  const convertAndDescribePDF = async (pdfBuffer) => {
    const convert = convertPdfToPng(pdfBuffer, pdf2picOptions);
    await convert(1, { responseType: "base64" }).then((data)=>console.log("cl: "+data))
    console.log("213 "+ pageOutput)
    const base64Img = pageOutput.base64;
    const description = await describeImage(base64Img);
    return description;
  };
  // Extraer texto y describir imagen de todos los archivos PDF
  const processedPDFs = await Promise.all(
    pdfFiles.map(async (file) => {
      const fileBuffer = await file.arrayBuffer();
      const pdfBuffer = Buffer.from(fileBuffer);
      const text = await extractTextFromPDF(pdfBuffer);
      const description = await convertAndDescribePDF(pdfBuffer);
      return { text, description };
    })
  );

  // Combinar textos y descripciones en un solo string
  const combinedText = processedPDFs.map(pdf => pdf.text).join("\n");
  const combinedDescriptions = processedPDFs.map(pdf => pdf.description).join("\n");

  // Definir el prompt con el texto extraído de los currículums
  const assistantPrompt =
    "Eres una asistente de recursos humanos que busca a profesionales. Tu labor va a ser revisar currículums y seleccionar candidatos conforme a lo que se te pida. Asegúrate de tener en cuenta habilidades técnicas, experiencia laboral y cualquier otra competencia relevante para el puesto.";

  const prompt = `
${assistantPrompt}

Buscamos específicamente un perfil con las siguientes características:
- Puesto: ${profileSearch}
- Habilidades: ${skills}
- Experiencia: ${experience}

Por favor, revisa los currículums y selecciona aquellos que más se ajusten a estos criterios. Proporcióname el nombre del candidato, sus habilidades, su experiencia y un resumen general.

Descripciones de las imágenes de los currículums:
${combinedDescriptions}

Texto de los currículums:
${combinedText}

dale un numero de estrellas del 1 al 5 al candidato segun su perfil
    
Responde en idioma ${language}.
`;

  // Generar objeto JSON usando OpenAI
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      candidate: z.object({
        name: z.string(),
        skills: z.array(z.string()),
        experience: z.array(z.string()),
        resume: z.string(),
        why: z.string(),
        isApproved: z.boolean(),
        stars: z.number(),
      }),
    }),
    prompt: prompt,
  });

  return new Response(JSON.stringify(object), { status: 200 });
}
