import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LoginBtn from "./components/loginBtn";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  // If already logged in, redirect straight to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        {/* 1. App Name matching Google Config */}
        {/* Replace this text with your svg logo later if you want */}
        <div>
          <Image
            src="/logo.jpg"
            alt="Nyuszi Logo"
            width={128}
            height={128}
            priority
            className="mx-auto mb-4 w-32 h-32 object-contain"
          />
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
            Nyuszi
          </h1>
        </div>

        <p className="text-xl text-slate-600 max-w-md mb-10">
          Sync your Google Calendar to your E-Ink display automatically.
        </p>

        {/* 2. Login Button */}
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <p className="text-gray-700 mb-4">Get started by signing in.</p>
          <LoginBtn isLoggedIn={false} />
        </div>
      </main>

      {/* 3. Footer with Required Links */}
      <footer className="py-6 text-center text-sm text-slate-500">
        <div className="space-x-6">
          <Link
            href="/legal/terms"
            className="hover:underline hover:text-slate-700"
          >
            Terms of Service
          </Link>
          <Link
            href="/legal/privacy"
            className="hover:underline hover:text-slate-700"
          >
            Privacy Policy
          </Link>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} Nyuszi project.</p>
      </footer>
    </div>
  );
}
