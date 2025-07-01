"use client";

import React, { useRef } from "react";
import { BgImagesContainer } from "./bgImagesContainer";

export default function ImageAnimation() {
    const bgImagesSharedRef = useRef<gsap.core.Tween | null>(null);
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <BgImagesContainer bgImagesSharedRef={bgImagesSharedRef} />
    </div>
  );
} 