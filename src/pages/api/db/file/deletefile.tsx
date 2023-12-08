import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function deleteFile(fileKey: string) {
  try {
    await prisma.file.delete({
      where: {
        filekey: fileKey
      },
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileKey } = req.body;

  try {
    await deleteFile(fileKey);
    await prisma.$disconnect();
    res.status(200).json({ message: 'deleted' });
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
