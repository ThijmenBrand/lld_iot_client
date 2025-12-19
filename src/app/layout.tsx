import { getServerSession } from "next-auth/next";
import Providers from "../providers/Providers";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log(authOptions);

  console.log("Layout session:", session);

  return (
    <html lang="en">
      <Providers session={session}>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
