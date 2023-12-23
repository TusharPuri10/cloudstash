import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function changeLimit(id: string, folderLimit: number, fileLimit: number) {
    try {
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                fileLimit: fileLimit,
            },
        });
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw error; // Propagate the error for better error handling
    }
  }
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { id, folderLimit, fileLimit } = req.body;
  
    try {
       await changeLimit(id, folderLimit, fileLimit);
      await prisma.$disconnect();
      res.status(200).json( {message: "Limit changed successfully"});
    } catch (error) {
      console.error("Error in API handler:", error);
      await prisma.$disconnect();
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
