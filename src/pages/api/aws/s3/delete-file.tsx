import type { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

export default async function awsUploader(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const client_s3 = new S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4",
  });

  const config = {
    api: {
      bodyParser: {
        sizeLimit: "10mb",
      },
    },
  };

  switch (method) {
    case "GET":
      res.status(405).json({ success: false });
      console.log("AWS S3 API - get_file.tsx - No GET method");
      break;

    case "POST":
  try {
    if (!process.env.BUCKET_NAME) {
        res.status(500).json({ success: false, message: 'BUCKET_NAME not set' });
        return;
      }

    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.body.file_key,
    };

    await client_s3.deleteObject(deleteParams).promise();

    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
    console.log("AWS S3 API - delete_file.tsx - POST Error:", error);
  }
  break;

  }
}