import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(request) {
  try {
    const { key } = await request.json();

    if (!key) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "La clave de API de OpenAI es requerida.",
        }),
        {
          status: 400,
        }
      );
    }

    const openai = createOpenAI({ apiKey: key });

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      temperature: 1,
      prompt:
        "Genera un mensaje corto y gracioso diciendo que tu clave de API de OpenAI es correcta y ha sido guardada. asi como que no esta segura del todo.",
    });

    return new Response(
      JSON.stringify({
        message: text,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
