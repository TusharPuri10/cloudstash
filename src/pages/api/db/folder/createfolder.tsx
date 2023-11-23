import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function createFolder(email: string, folderName: string, parentFolderId?: number) {
  try {
    const folderid = await prisma.folder.create({
      data: {
        userEmail: email,
        name: folderName,
        parentId: parentFolderId,
      },
      select: {
        id: true,
      },
    });

    return  folderid.id;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, folderName, parentFolderId } = req.body;

  try {
    const folderid = await createFolder(email, folderName, parentFolderId);
    await prisma.$disconnect();
    res.status(200).json({ message: 'created', folderid });
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
