import Link from "next/link";

import { auth, signIn, signOut } from "@/server/auth";

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
          </div>
        </div>
      </div>
    </main>
  );
}
