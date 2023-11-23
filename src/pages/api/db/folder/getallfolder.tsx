import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function getFoldersInsideFolder(parentFolderId: number,email:string) {
  try {
    if(parentFolderId === -1){//shared folder
        const folders = await prisma.folder.findMany({
            where: {
            userEmail: email,
            id: -1,
            },
            include: {
            files: true,
            },
        });
        return folders[0].files;
    }
    const folders = await prisma.folder.findMany({
      where: {
        parentId: parentFolderId,
      },
      // Select id, name, createdAt, and updatedAt fields
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return folders;
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { parentFolderId, email } = req.body;

  if (!parentFolderId) {
    res.status(400).json({ error: "Missing parentFolderId parameter" });
    return;
  }

  try {
    const folders = await getFoldersInsideFolder(Number(parentFolderId),email);
    await prisma.$disconnect();
    if(parentFolderId === -1)   res.status(200).json({ files: folders }); //shared folder case : getting files here instead of folders
    else    res.status(200).json({ folders }); // normal folder
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
