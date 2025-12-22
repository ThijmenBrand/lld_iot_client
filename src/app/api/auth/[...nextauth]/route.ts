import NextAuth, { NextAuthOptions } from "next-auth";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import Google from "next-auth/providers/google";
import { db } from "@/src/utils/firebase.admin";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.readonly",
        },
      },
    }),
  ],
  adapter: FirestoreAdapter(db),
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        // 1. If using JWT (strategy: "jwt"), the ID is in 'token.sub'
        // 2. If using Database (strategy: "database"), the ID is in 'user.id'
        session.user.id = token?.sub || user?.id || session.user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;

      return `${baseUrl}/dashboard`;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
