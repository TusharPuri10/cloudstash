import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function main() {
    await prisma.user.create({
        data:   {
            id: "user1",
            email: "iamtusharpuri@gmail.com",
            rootURL: "abc",
            folders: {
                create: [
                    {
                        name: "root",
                    }
                ]
            }
        }
    })
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    main()
    .then(async () => {
      await prisma.$disconnect()
      res.status(200).json({ message: 'created' })
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
  }
  