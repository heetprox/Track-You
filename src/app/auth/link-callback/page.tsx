"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LinkCallback() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  
  // Use try/catch to handle any session errors
  let sessionStatus;
  try {
    const { status } = useSession();
    sessionStatus = status;
  } catch (err) {
    console.error("Session error:", err);
    sessionStatus = "error";
  }

  useEffect(() => {
    if (redirecting) return;
    
    // Set a fallback timeout to ensure we always redirect
    const fallbackTimer = setTimeout(() => {
      router.push("/profile");
    }, 2000);
    
    // Handle based on status
    if (sessionStatus === "authenticated") {
      setRedirecting(true);
      console.log("Successfully authenticated with GitHub");
      router.push("/profile");
    } else if (sessionStatus === "unauthenticated" || sessionStatus === "error") {
      setRedirecting(true);
      router.push("/profile");
    }
    
    return () => clearTimeout(fallbackTimer);
  }, [sessionStatus, router, redirecting]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="bg-white/10 p-8 rounded-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Account Linking</h1>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse"></div>
            <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p>Processing... Redirecting you back to your profile.</p>
        </div>
      </div>
    </div>
  );
} 