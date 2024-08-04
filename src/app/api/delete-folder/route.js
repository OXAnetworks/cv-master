import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { createClient } from "@/utils/supabase/server";

const s3Client = new S3Client({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCES_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

export async function POST(request) {
  const supabase = createClient();

  const formData = await request.formData();
  const userName = formData.get("userName");
  const folderName = formData.get("folderName");

  if (!userName || !folderName) {
    return new Response("User name and folder name are required.", {
      status: 400,
    });
  }

  const folderKey = `${userName}/${folderName}/`;

  const listParams = {
    Bucket: process.env.BUCKET, // Nombre del bucket
    Prefix: folderKey, // Prefijo de la carpeta
  };

  try {
    // Listar todos los objetos en la carpeta
    const listCommand = new ListObjectsV2Command(listParams);
    const listData = await s3Client.send(listCommand);

    const objectsToDelete = listData.Contents
      ? listData.Contents.map((item) => ({ Key: item.Key }))
      : [];

    if (objectsToDelete.length === 0) {
      return new Response("No objects found in the specified folder.", {
        status: 404,
      });
    }

    const deleteParams = {
      Bucket: process.env.BUCKET,
      Delete: {
        Objects: objectsToDelete,
        Quiet: true,
      },
    };

    // Eliminar todos los objetos listados
    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3Client.send(deleteCommand);

    const { error } = await supabase
      .from("vacancies")
      .delete()
      .eq("s3_route", folderKey);

    if (error) {
      return new Response("Error deleting folder in Supabase.", {
        status: 500,
      });
    }

    return new Response(
      `Folder ${folderName} deleted successfully at path ${userName}/${folderName}`,
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response("Error deleting folder in S3.", { status: 500 });
  }
}
