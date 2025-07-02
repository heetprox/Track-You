import { auth } from "@/server/auth";
import ClientShuffleWrapper from "@/components/ClientShuffleWrapper";
import Top from "@/components/home/Top";

export default async function Home() {
  const session = await auth();

  return (
    <Top />
  );
}
