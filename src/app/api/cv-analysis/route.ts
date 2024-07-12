import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import pdfParse from "pdf-parse";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files");

  // Filtrar archivos PDF
  const pdfFiles = files.filter((file) => file.type === "application/pdf");

  console.log(pdfFiles);

  // Función para extraer texto de un PDF
  const extractTextFromPDF = async (pdfBuffer: any) => {
    console.log(pdfBuffer);
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

  const profileSearch = "Desarrollador backend con conocimiento en Golang";
  const habilidades =
    "Conocimiento avanzado en Golang, experiencia con bases de datos SQL y NoSQL, comprensión de microservicios, experiencia con sistemas de versionado como Git";
  const experiencia =
    "Mínimo 3 años de experiencia en desarrollo backend, experiencia previa en empresas de tecnología o startups, participación en proyectos ágiles";

  const prompt = `
${assistantPrompt}

Buscamos específicamente un perfil con las siguientes características:
- Puesto: ${profileSearch}
- Habilidades: ${habilidades}
- Experiencia: ${experiencia}

Por favor, revisa los currículums y selecciona aquellos que más se ajusten a estos criterios. Proporcióname el nombre del candidato, sus habilidades, su experiencia y un resumen general.

Texto de los currículums:
${combinedText}
    `;

  // Generar objeto JSON usando OpenAI
  const { object } = await generateObject({
    model: openai("gpt-4-turbo"),
    schema: z.object({
      candidate: z.object({
        name: z.string(),
        skills: z.array(z.string()),
        experience: z.array(z.string()),
        resume: z.string(),
        why: z.string(),
      }),
    }),
    prompt: prompt,
  });

  return new Response(JSON.stringify(object), { status: 200 });
}
