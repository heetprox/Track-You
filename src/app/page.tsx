import { auth } from "@/server/auth";
import ClientShuffleWrapper from "@/components/ClientShuffleWrapper";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-[100vh] w-full overflow-hidden flex-col items-center justify-center text-white">
      <div className="w-full">
        <ClientShuffleWrapper />
      </div>
    </main>
  );
}
