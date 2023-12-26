import { PrismaClient } from '.prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient().$extends(withAccelerate());

export default prisma;