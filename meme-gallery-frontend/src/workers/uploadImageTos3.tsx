import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const awsRegion = process.env.NEXT_PUBLIC_AWS_REGION!;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!;
const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!;

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadImageToS3(file: File): Promise<string> {
  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const Bucket = bucketName;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
      Bucket,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(params));
    return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload image");
  }
}
