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

  switch (method) {
    case "GET":
      res.status(405).json({ success: false });
      console.log("AWS S3 API - get_file.tsx - No GET method");
      break;

    case "POST":
      try {
        const fileParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: req.body.file_key,
          Expires: 60 * 60,
          ResponseContentDisposition: 'attachment; filename=' + req.body.file_name + '',
        };

        const url = await client_s3.getSignedUrlPromise(
          "getObject",
          fileParams
        );

        res.status(200).json({ success: true, url: url });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
        console.log("AWS S3 API - get_file.tsx - POST Error:", error);
      }
      break;
  }
}