"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
  session?: Session | null;
};

export default function Providers({ children, session }: ProvidersProps) {
  console.log("Providers session:", session);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
