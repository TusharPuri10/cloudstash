import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function renameFolder(folderId: number, newName: string) {
  try {
    await prisma.folder.update({
      
      where: {
        id: folderId,
      },
      data: {
        name: newName,
      },
    });
  } catch (error) {
    console.error("Error renaming folder:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { folderId, newName } = req.body;

  try {
    await renameFolder(folderId, newName);
    await prisma.$disconnect();
    res.status(200).json({ message: 'renamed'});
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
