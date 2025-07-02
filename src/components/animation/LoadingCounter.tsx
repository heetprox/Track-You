"use client";

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import './loader.css';
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";

interface LoadingCounterProps {
  children: React.ReactNode;
}

export default function LoadingCounter({ children }: LoadingCounterProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Register GSAP plugins
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(CustomEase);
      CustomEase.create("hop", "0.9, 0, 0.1, 1");
    }
    
    // Hide loader after animation completes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 6000); // Adjust timing to match animation duration
    
    return () => clearTimeout(timer);
  }, []);
  
  // GSAP animations using useGSAP
  useGSAP(() => {
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: {
        ease: "hop",
      },
    });

    const counts = document.querySelectorAll(".count");

    counts.forEach((count, index) => {
      const digits = count.querySelectorAll(".digit h1");

      tl.to(
        digits,
        {
          y: "0%",
          duration: 1,
          stagger: 0.075,
        },
        index * 1
      );

      if (index < counts.length - 1) {
        tl.to(
          digits,
          {
            y: "-100%",
            duration: 1,
            stagger: 0.075,
          },
          index * 1 + 1
        );
      }
    });

    tl.to(
      ".block",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        stagger: 0.1,
        delay: 0.75,
      },
      "<"
    );
  });

  return (
    <>
      <div className={`loader ${isLoading ? 'z-[999]' : 'pointer-events-none opacity-0'} z-[999] transition-opacity duration-500`}>
        <div className="overlay">
          <div className="block"></div>
          <div className="block"></div>
        </div>

        <div className="counter">
          {/* 00% - Center of screen (default position) */}
          <div className="count count-center">
            <div className="digit">
              <h1>0</h1>
            </div>
            <div className="digit">
              <h1>0</h1>
            </div>
            <div className="digit">
              <h1>%</h1>
            </div>
          </div>
          
          {/* 27% - Top left of screen */}
          <div className="count count-top-left">
            <div className="digit">
              <h1>2</h1>
            </div>
            <div className="digit">
              <h1>7</h1>
            </div>
            <div className="digit">
              <h1>%</h1>
            </div>
          </div>
          
          {/* 65% - Right and center of screen */}
          <div className="count count-right-center">
            <div className="digit">
              <h1>6</h1>
            </div>
            <div className="digit">
              <h1>5</h1>
            </div>
            <div className="digit">
              <h1>%</h1>
            </div>
          </div>
          
          {/* 98% - Bottom left of screen */}
          <div className="count count-bottom-left">
            <div className="digit">
              <h1>9</h1>
            </div>
            <div className="digit">
              <h1>8</h1>
            </div>
            <div className="digit">
              <h1>%</h1>
            </div>
          </div>
          
          {/* 99% - Back to center of screen */}
          <div className="count count-center-final">
            <div className="digit">
              <h1>9</h1>
            </div>
            <div className="digit">
              <h1>9</h1>
            </div>
            <div className="digit">
              <h1>%</h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-1000"}>
        {children}
      </div>
    </>
  );
} 