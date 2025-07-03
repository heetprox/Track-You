import { auth } from "@/server/auth";
import ClientShuffleWrapper from "@/components/ClientShuffleWrapper";
import Top from "@/components/home/Top";
import HomeLoader from "@/components/animation/HomeLoader";
import Features from "@/components/home/Features";
import Working from "@/components/home/Working";

export default async function Home() {
  // const session = await auth();

  return (
    <HomeLoader>
      <Top />
      <Features />
      <Working />
    </HomeLoader>
  );
}
