"use client";

import React from 'react';
import LoadingCounter from './LoadingCounter';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

// Register GSAP plugins on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

interface HomeLoaderProps {
  children: React.ReactNode;
}

export default function HomeLoader({ children }: HomeLoaderProps) {
  return (
    <LoadingCounter>
      {children}
    </LoadingCounter>
  );
} 