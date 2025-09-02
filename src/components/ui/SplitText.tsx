"use client";
import React, { useRef,type ReactNode, useEffect, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface TextSplitProps {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}

export default function TextSplit({ 
  children, 
  animateOnScroll = true, 
  delay = 0 
}: TextSplitProps) {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Wait for component to mount before initializing animations
  useEffect(() => {
    setIsReady(true);
    return () => {
      hasInitialized.current = false;
    };
  }, []);

  useGSAP(() => {
    if (!containerRef.current || !isReady || hasInitialized.current) return;
    
    hasInitialized.current = true;
    
    // Create the split text animation
    const splitText = new SplitText(containerRef.current, {
      type: "lines",
      linesClass: "overflow-hidden"
    });
    
    // Create another split for the line elements
    const lineSplits = new SplitText(splitText.lines, {
      type: "lines",
      linesClass: "split-child"
    });
    
    // Set initial state
    gsap.set(lineSplits.lines, { 
      y: "100%", 
      opacity: 1 
    });
    
    // Animate in
    gsap.to(lineSplits.lines, {
      opacity: 1,
      y: "0%",
      duration: 2,
      stagger: 0.08,
      ease: "power4.out",
      delay: delay,
      scrollTrigger: animateOnScroll ? {
        trigger: containerRef.current,
        start: "top 85%",
        once: true
  }, { scope: containerRef, dependencies: [isReady, delay, animateOnScroll] });

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}