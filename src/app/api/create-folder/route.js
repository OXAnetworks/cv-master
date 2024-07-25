import AWS from 'aws-sdk';


const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCES_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  endpoint: process.env.ENDPOINT,
  region: process.env.REGION,
  s3ForcePathStyle: true
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
    await s3.putObject(params).promise();
    return new Response(`Folder ${folderName} created successfully at path ${userName}/${folderName}`, { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Error creating folder in S3.', { status: 500 });
  }
}