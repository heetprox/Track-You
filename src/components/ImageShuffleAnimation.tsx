"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

// SVG logo data
const svgLogos = [
  { id: 1, path: "/svg_logo/after-effects-logo.svg" },
  { id: 2, path: "/svg_logo/attributes-logo.svg" },
  { id: 3, path: "/svg_logo/client-first-logo.svg" },
  { id: 4, path: "/svg_logo/figma-logo.svg" },
  { id: 5, path: "/svg_logo/framer-logo.svg" },
  { id: 6, path: "/svg_logo/gsap-logo.svg" },
  { id: 7, path: "/svg_logo/mailchimp-logo.svg" },
  { id: 8, path: "/svg_logo/nextjs-logo.svg" },
  { id: 9, path: "/svg_logo/photoshop-logo.svg" },
  { id: 10, path: "/svg_logo/react-logo.svg" },
  { id: 11, path: "/svg_logo/spline-logo.svg" },
  { id: 12, path: "/svg_logo/tailwind-logo.svg" },
  { id: 13, path: "/svg_logo/typescript-logo.svg" },
  { id: 14, path: "/svg_logo/webflow-logo.svg" },
];

// Helper functions
const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const getRandValues = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandDistrubutedTop = (index: number, total: number) => {
  const mid = Math.floor(total / 2);
  if (index === 0) return 65;
  if (index === total - 1) return 35;
  if (index === mid) return 50;
  if (index < mid) return getRandValues(30, 60);
  if (index > mid) return getRandValues(40, 70);
  return getRandValues(30, 70);
};

// ImageShuffleAnimation component
export default function ImageShuffleAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shuffledLogos = useRef(shuffle([...svgLogos]));
  const GAP = 6;
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Dynamically import CustomEase to avoid SSR issues
    const loadGSAP = async () => {
      try {
        // Only register plugin on client
        const CustomEaseModule = await import("gsap/CustomEase");
        gsap.registerPlugin(CustomEaseModule.CustomEase);
      } catch (error) {
        console.error("Failed to load GSAP plugins:", error);
      }
      
      const images = document.querySelectorAll(".logo-image");
      
      // Initial animation
      gsap.fromTo(
        images,
        {
          y: "200%",
          x: "0%",
          left: "50%",
          rotate: 0,
          top: "50%",
        },
        {
          y: "-50%",
          x: "0%",
          left: (index) => 90 + index * -GAP + "%",
          top: (index, target, targets) => getRandDistrubutedTop(index, targets.length) + "%",
          rotate: () => getRandValues(-30, 30),
          delay: 0.8,
          stagger: 0.08,
          duration: 1,
          ease: "power3.out",
        }
      );
    };
    
    loadGSAP();

    // Clean up
    return () => {
      gsap.killTweensOf(".logo-image");
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
    <div className="relative w-[80%] h-[60vh] overflow-hidden bg-transparent" ref={containerRef}>
      {shuffledLogos.current.map((logo, i) => (
        <div
          key={logo.id}
          className="logo-image absolute h-[150px] w-[150px] origin-center translate-x-[-50%] translate-y-[0%] overflow-hidden rounded-3xl md:h-[200px] md:w-[200px]"
          style={{
            filter: "brightness(85%)",
            zIndex: Math.floor(shuffledLogos.current.length / 2) === i 
              ? 520 
              : Math.floor(Math.random() * 10)
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={logo.path}
              fill={true}
              alt=""
              className="h-full w-auto min-w-full max-w-none object-cover"
            />
          </div>
        </div>
      ))}
    </div>
    </div>

  );
} 