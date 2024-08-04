const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

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
  try {
    const formData = await request.formData();
    const path = formData.get("path");

    const params = {
      Bucket: process.env.BUCKET,
      Key: path,
    };

    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    // Convertir el cuerpo de la respuesta a un buffer
    const chunks = [];
    for await (let chunk of response.Body) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Enviar el buffer como respuesta
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${path
          .split("/")
          .pop()}"`,
        "Content-Length": buffer.length,
      },
    });
  } catch (err) {
    console.error("Error al obtener el objeto de S3:", err);
    return new Response("Error getting object from S3", { status: 500 });
  }
}
