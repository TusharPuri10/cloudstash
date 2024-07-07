import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function getFoldersInsideFolder(parentFolderId: number,userId:string) {
  try {
    const folders = await prisma.folder.findMany({
      cacheStrategy: { ttl: 3_600 }, 
      where: {
        parentId: parentFolderId,
        userId: userId,
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
  const { parentFolderId, userId } = req.body;

  try {
    const folders = await getFoldersInsideFolder(parentFolderId,userId);
    await prisma.$disconnect();
    res.status(200).json({ folders });
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
