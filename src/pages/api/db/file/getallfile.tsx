import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function getAllFilesInFolder(folderId: number) {
  try {
    
    const files = await prisma.file.findMany({
      where: {
        folderId: folderId,
      },
      // Select id, name, type, createdAt, and updatedAt fields
      select: {
        name: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        fileURL: true
      },
    });

    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { folderId } = req.body;

  if (!folderId) {
    res.status(400).json({ error: "Missing folderId parameter" });
    return;
  }

  try {
    const files = await getAllFilesInFolder(folderId);
    await prisma.$disconnect();
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
