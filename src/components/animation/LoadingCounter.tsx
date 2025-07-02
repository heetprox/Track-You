"use client";

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import './loader.css';

interface LoadingCounterProps {
  children: React.ReactNode;
}

export default function LoadingCounter({ children }: LoadingCounterProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Register GSAP plugins
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create custom ease if available
      try {
        // @ts-ignore
        gsap.registerPlugin(CustomEase);
        // @ts-ignore
        CustomEase.create("hop", "0.9, 0, 0.1, 1");
      } catch (e) {
        console.log("CustomEase plugin not available, using default ease");
      }
    }
    
    // Hide loader after animation completes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 6000); // Adjust timing to match animation duration
    
    return () => clearTimeout(timer);
  }, []);
  
  // GSAP animations
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoading) {
      const tl = gsap.timeline({
        delay: 0.3,
        defaults: {
          ease: "power3.inOut",
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
    }
  }, [isLoading]);

  return (
    <>
      <div className={`loader ${isLoading ? '' : 'hidden'}`}>
        <div className="overlay">
          <div className="block"></div>
          <div className="block"></div>
        </div>

        <div className="counter">
          <div className="count">
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
          
          <div className="count">
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
          
          <div className="count">
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
          
          <div className="count">
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
          
          <div className="count">
            <div className="digit">
              <h1>1</h1>
            </div>
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
        </div>
      </div>
      
      {/* Content */}
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-1000"}>
        {children}
      </div>
    </>
  );
} 