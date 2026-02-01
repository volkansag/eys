import { PrismaClient } from "~~/prisma/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const prismaClientSingleton = () => {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:prisma/db.sqlite",
  });
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  db: PrismaClientSingleton | undefined;
};

const db = globalForPrisma.db ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

export { db };
