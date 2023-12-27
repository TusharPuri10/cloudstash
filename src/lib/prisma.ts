import { PrismaClient } from '@prisma/client/edge'

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

export default prisma;