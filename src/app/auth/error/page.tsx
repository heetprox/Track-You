"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Authentication Error
        </h1>
        <div className="bg-white/10 p-8 rounded-xl max-w-md w-full">
          <div className="flex flex-col gap-4">
            <p className="text-lg">
              {error === "Configuration"
                ? "There is a problem with the server authentication configuration."
                : error === "AccessDenied"
                ? "You do not have permission to sign in."
                : error === "Verification"
                ? "The token has expired or has already been used."
                : error === "Default"
                ? "Unable to sign in."
                : `An authentication error occurred: ${error}`}
            </p>
            <p className="text-sm opacity-80">
              If this problem persists, please contact support.
            </p>
            <Link
              href="/"
              className="mt-4 rounded-md bg-purple-600 px-6 py-3 text-center font-semibold text-white"
            >
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 