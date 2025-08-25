import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // Can be added later if needed
  },
  user: {
    modelName: "users", // This will be created by Better Auth
  },
  session: {
    modelName: "sessions", // This will be created by Better Auth
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  account: {
    modelName: "accounts", // This will be created by Better Auth
  },
  verification: {
    modelName: "verifications", // This will be created by Better Auth
  },
  trustedOrigins: ["http://localhost:5173", "http://localhost:3000"],
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});