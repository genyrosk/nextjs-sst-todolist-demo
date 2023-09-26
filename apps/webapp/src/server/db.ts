import { PrismaClient } from "@prisma/client";

import { env } from "@/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  prisma.$use(async (params, next) => {
    // Check incoming query type
    if (params.model && ["Todo"].includes(params.model)) {
      if (params.action == "delete") {
        // Delete queries
        // Change action to an update
        params.action = "update";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        params.args.data = { deleted: true };
      }
      if (params.action == "deleteMany") {
        // Delete many queries
        params.action = "updateMany";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (params.args.data != undefined) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          params.args.data.deleted = true;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          params.args.data = { deleted: true };
        }
      }
    }
    return next(params);
  });

  return prisma;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
