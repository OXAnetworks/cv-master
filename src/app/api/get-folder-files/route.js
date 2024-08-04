import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCES_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // Configuración equivalente a s3ForcePathStyle
});

export async function POST(request) {
  const formData = await request.formData();
  const path = formData.get("path");

  if (!path || path.includes("..")) {
    return new Response("Path is required and cannot contain '..'", {
      status: 400,
    });
  }

  // console.log("🚀 ~ POST ~ path:", path);

  const params = {
    Bucket: process.env.BUCKET,
    Prefix: path,
  };

  try {
    // Ejecuta el comando para listar los objetos
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);

    if (!data.Contents) {
      return new Response("No files found", { status: 400 });
    }

    // Envía la lista de archivos como respuesta
    const files = data.Contents.map((item) => item.Key);
    // console.log("🚀 ~ POST ~ files:", files);
    return new Response(JSON.stringify(files), { status: 200 });
  } catch (error) {
    console.error(`Error al obtener los archivos: ${error.message}`);
    return new Response("Error getting files from S3", { status: 500 });
  }
}
