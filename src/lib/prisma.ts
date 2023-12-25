import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

const prisma =  new PrismaClient();

export default prisma;