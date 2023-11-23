import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function main(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return Boolean(user);
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  try {
    const userExists = await main(email);

    if (userExists) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
