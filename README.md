# CV-Master :D


## Bibliotecas

imprescindible(VERCEL) -> AI SDK CORE 
pdfparse
i18next

## IDEA PROMPT
```js

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const assistantPrompt = "Eres una asistente de recursos humanos que busca a profesionales. Tu labor va a ser revisar currículums y seleccionar candidatos conforme a lo que se te pida. Asegúrate de tener en cuenta habilidades técnicas, experiencia laboral y cualquier otra competencia relevante para el puesto.";

const profileSearch = "Desarrollador backend con conocimiento en Golang";
const habilidades = "Conocimiento avanzado en Golang, experiencia con bases de datos SQL y NoSQL, comprensión de microservicios, experiencia con sistemas de versionado como Git";
const experiencia = "Mínimo 3 años de experiencia en desarrollo backend, experiencia previa en empresas de tecnología o startups, participación en proyectos ágiles";

const prompt = `
${assistantPrompt}

Buscamos específicamente un perfil con las siguientes características:
- Puesto: ${profileSearch}
- Habilidades: ${habilidades}
- Experiencia: ${experiencia}

Por favor, revisa los currículums y selecciona aquellos que más se ajusten a estos criterios. Proporcióname el nombre del candidato, sus habilidades, su experiencia y un resumen general.
`;

const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    candidate: z.object({
      name: z.string(),
      habilidades: z.array(z.string()),
      experiencia: z.array(z.string()),
      resumen: z.string(),
    }),
  }),
  prompt: prompt,
});

```
_____

# NEXTJS

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

