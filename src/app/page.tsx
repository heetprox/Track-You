import Link from "next/link";

import AuthButtons from "./_components/auth-buttons";
import { auth } from "@/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-[150vh] w-full overflow-hidden flex-col items-center justify-center  text-white">
      
    </main>
  );
}
