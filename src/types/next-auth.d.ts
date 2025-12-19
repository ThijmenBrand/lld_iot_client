import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // This tells TypeScript: "Trust me, there is an ID here"
    } & DefaultSession["user"];
  }
}
