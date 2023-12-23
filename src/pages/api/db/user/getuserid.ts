import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function getuserid(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email, 
      },
      // Select id
      select: {
        id: true,
        fileLimit: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  try {
    const user = await getuserid(email);
    await prisma.$disconnect();
    res.status(200).json( user);
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
