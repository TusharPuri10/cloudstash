import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function renameFile(fileKey: string, newName: string) {
  try {
    await prisma.file.update({
      where: {
        filekey: fileKey,
      },
      data: {
        name: newName,
      },
    });

  } catch (error) {
    console.error("Error renaming file:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileKey, newName } = req.body;

  try {
    await renameFile(fileKey, newName);
    await prisma.$disconnect();
    res.status(200).json({ message: 'renamed'});
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
