"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";

interface AuthButtonsProps {
  session: Session | null;
}

export default function AuthButtons({ session }: AuthButtonsProps) {
  return (
    <div className="text-lg">
      {session?.user ? (
        <>
          <p>Logged in as {session.user.name}</p>
          <div className="flex flex-row gap-4 mt-4">
            <Link
              href="/profile"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Profile
            </Link>
            <button
              onClick={async () => {
                await signOut({ redirectTo: "/" });
              }}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Sign out
            </button>
          </div>
        </>
      ) : (
        <Link
          href="/auth/signin"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign in
        </Link>
      )}
    </div>
  );
} 