import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCES_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  },
  forcePathStyle: true // Configuración equivalente a s3ForcePathStyle
});

export async function POST(request) {
  const formData = await request.formData();
  const userName = formData.get('userName');
  const folderName = formData.get('folderName');
  
  if (!userName || !folderName) {
    return new Response('User name and folder name are required.', { status: 400 });
  }

  const folderKey = `${userName}/${folderName}/`;

  const params = {
    Bucket: process.env.BUCKET, // Nombre del bucket
    Key: folderKey // Clave del objeto (nombre de la carpeta)
  };

  try {
    // La forma de crear una carpeta en S3 es subir un objeto vacío con el sufijo "/"
    const putCommand = new PutObjectCommand(params);
    await s3Client.send(putCommand);
    return new Response(`Folder ${folderName} created successfully at path ${userName}/${folderName}`, { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Error creating folder in S3.', { status: 500 });
  }
}
