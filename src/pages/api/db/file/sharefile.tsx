import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function shareFile(
  copiedFileKey: string,
  originalFileKey: string,
  userEmail: string
) {
  try {
    // Check if the user with the specified email exists
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return { message: "User not found", type: "error" };
    }

    // Find the source file information
    const sourceFile = await prisma.file.findUnique({
      where: {
        filekey: originalFileKey,
      },
    });

    if (!sourceFile) {
      throw new Error("Original file not found");
    }

    // Find the "shared" folder
    const sharedFolder = await prisma.folder.findFirst({
      where: {
        name: "shared",
        userId: user.id,
      },
    });

    if (!sharedFolder) {
      //create shared folder
      const sharedFolder = await prisma.folder.create({
        data: {
          name: "shared",
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      // Copy the file into the "shared" folder
      await prisma.file.create({
        data: {
          folderId: sharedFolder.id,
          owner: sourceFile.owner,
          name: sourceFile.name,
          type: sourceFile.type,
          filekey: copiedFileKey,
          sharekey: originalFileKey,
        },
      });
    } else {
      // Copy the file into the "shared" folder
      await prisma.file.create({
        data: {
          folderId: sharedFolder.id,
          owner: sourceFile.owner,
          name: sourceFile.name,
          type: sourceFile.type,
          filekey: copiedFileKey,
          sharekey: originalFileKey,
        },
      });
    }

    return { message: "File shared", type: "success" };
  } catch (error) {
    console.error("Error sharing file:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { copiedfilekey, originalfilekey, userEmail } = req.body;

  if (!copiedfilekey || !originalfilekey || !userEmail) {
    res
      .status(400)
      .json({
        error: "Missing copiedFileURL, originalFileURL, or userEmail parameter",
      });
    return;
  }

  try {
    const message = await shareFile(copiedfilekey, originalfilekey, userEmail);
    await prisma.$disconnect();
    res.status(200).json(message);
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
