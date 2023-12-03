import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function getmainFolder(userId: string, folderName: string) {
  try {
    const folders = await prisma.folder.findFirst({
      where: {
        name: folderName,
        userId: userId
      },
      select: {
        id: true,
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
  const { userId, folderName } = req.body;

  try {
    const mainFolder = await getmainFolder(userId, folderName);
    await prisma.$disconnect();
    res.status(200).json( mainFolder);
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
