"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

export default function LinkGitHubButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkGitHub = async () => {
    setIsLoading(true);
    
    // Use signIn to redirect to GitHub
    await signIn("github", { 
      callbackUrl: "/auth/link-callback",
      redirect: true
    });
  };

  return (
    <div className="mt-4 p-4 bg-indigo-900/30 border border-indigo-700/30 rounded-lg">
      <p className="flex items-center gap-2 mb-3">
        <FaGithub className="text-white" /> Connect your GitHub account for full access to all features.
      </p>
      <button
        onClick={handleLinkGitHub}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center justify-center gap-2 transition"
      >
        {isLoading ? (
          <>
            <div className="h-3 w-3 rounded-full bg-white animate-pulse mr-1"></div>
            <div className="h-3 w-3 rounded-full bg-white animate-pulse mr-1" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-3 w-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </>
        ) : (
          <>
            <FaGithub /> Connect with GitHub
          </>
        )}
      </button>
    </div>
  );
} 