import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function createFile(folderId: number, fileName: string, fileType: string,fileURL: string, owner: string) {
  try {
    await prisma.file.create({
      data: {
        folderId: folderId,
        name: fileName,
        type: fileType,
        fileURL: fileURL,
        owner: owner,
      }
    });
  } catch (error) {
    console.error("Error creating file:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { folderId, fileName, fileType, fileURL, owner } = req.body;

  try {
    await createFile(folderId, fileName, fileType, fileURL, owner);
    await prisma.$disconnect();
    res.status(200).json({ message: 'created' });
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
