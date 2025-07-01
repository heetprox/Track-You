"use client";

import dynamic from "next/dynamic";

// Import the ImageShuffleAnimation with dynamic import to ensure it only runs on client-side
const ImageShuffleAnimation = dynamic(
  () => import("@/components/ImageShuffleAnimation"), 
  { ssr: false }
);

export default function ClientShuffleWrapper() {
  return <ImageShuffleAnimation />;
} 