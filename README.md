# CV-Master :D


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

console.log(object);

```