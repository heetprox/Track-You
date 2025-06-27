import Link from "next/link";

import AuthButtons from "./_components/auth-buttons";
import { auth } from "@/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">Track</span>You
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">Authentication</h3>
            <AuthButtons session={session} />
          </div>
        </div>
      </div>
    </main>
  );
}
