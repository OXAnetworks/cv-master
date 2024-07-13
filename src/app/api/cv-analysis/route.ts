import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import pdfParse from "pdf-parse";

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.getAll("file");
  const profileSearch = formData.get("profileSearch");
  const skills = formData.get("skills");
  const experience = formData.get("experience");
  const language = formData.get("language");

  // Filtrar archivos PDF
  const pdfFiles = file.filter((file) => file.type === "application/pdf");

  console.log(pdfFiles);

  // Función para extraer texto de un PDF
  const extractTextFromPDF = async (pdfBuffer: any) => {
    try {
      const data = await pdfParse(pdfBuffer);
      return data.text;
    } catch (error) {
      return "";
    }
  };

  // Extraer texto de todos los archivos PDF
  const extractedTexts = await Promise.all(
    pdfFiles.map(async (file: any) => {
      const fileBuffer = await file.arrayBuffer();
      const pdfBuffer = Buffer.from(fileBuffer);
      return extractTextFromPDF(pdfBuffer);
    })
  );

  // Combinar textos extraídos en un solo string
  const combinedText = extractedTexts.join("\n");

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

Texto de los currículums:
${combinedText}

dale un numero de estrellas del 1 al 5 al candidato segun su perfil
    
Responde en idioma ${language}.
`;

  // Generar objeto JSON usando OpenAI
  const { object } = await generateObject({
    model: openai("gpt-4o"),
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
