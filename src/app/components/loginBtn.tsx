"use client";

import { signIn, signOut } from "next-auth/react";

interface LoginBtnProps {
  isLoggedIn: boolean;
}

export default function AuthBtn({ isLoggedIn }: LoginBtnProps) {
  if (isLoggedIn) {
    return <LogoutBtn />;
  }

  return <LoginBtn />;
}

function LogoutBtn() {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
    >
      SignOut
    </button>
  );
}

function LoginBtn() {
  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 text-sm text-green-600 border border-green-200 rounded hover:bg-green-50"
    >
      SignIn with Google
    </button>
  );
}
