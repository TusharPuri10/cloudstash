import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function createUserWithRootFolder(email: string) {
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        folders: {
          create: [
            {
              name: "root",
            },
            {
              id: -1,
              name: "shared",
            }
          ]
        }
      },
      // Include the created folder in the response
      include: {
        folders: true,
      },
    });

    // Extract the folder ID of the root folder
    const rootFolderId = user.folders[0].id;

    return rootFolderId;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  try {
    const rootFolderId = await createUserWithRootFolder(email);
    await prisma.$disconnect();
    res.status(200).json({ message: 'created', rootFolderId: rootFolderId });
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
