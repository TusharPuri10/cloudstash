import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function deleteUser(email: string) {
  try {
    await prisma.user.delete({
      where: {
        email: email,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error; // Propagate the error for better error handling
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  try {
    await deleteUser(email);
    await prisma.$disconnect();
    res.status(200).json({ message: 'deleted' });
  } catch (error) {
    console.error("Error in API handler:", error);
    await prisma.$disconnect();
    res.status(500).json({ error: "Internal Server Error" });
  }
}
