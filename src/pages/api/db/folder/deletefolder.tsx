import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function deleteFolder(folderId: number) {
  try {
    // Delete all files and subfolders inside the folder
    await prisma.folder.delete({
      
      where: {
          id: folderId 
      },
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { folderId } = req.body;

  try {
    await deleteFolder(folderId);
    await prisma.$disconnect();
    res.status(200).json({ message: 'deleted' });
  } catch (error) {
    // console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
