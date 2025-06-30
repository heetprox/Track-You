"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { skipToken } from "@tanstack/react-query";

interface SourceCodeEmbedding {
  id: string;
  fileName: string;
  summary: string;
  sourceCode: string;
}

export default function SourceCodePage() {
  const { id } = useParams();
  const projectId = typeof id === 'string' ? id : undefined;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<SourceCodeEmbedding | null>(null);

  // Use skipToken pattern to handle conditional fetching
  const { data: sourceFiles } = api.project.getSourceCode.useQuery(
    projectId ? { projectId } : skipToken,
    {
      enabled: !!projectId && !!session,
    }
  );
  
  // Update loading state when data is fetched
  useEffect(() => {
    if (sourceFiles !== undefined) {
      setLoading(false);
    }
  }, [sourceFiles]);

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center">
          <p>Loading source code data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Source Code Insights</h1>

        <div className="mb-6 flex gap-4">
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
          
          <Link 
            href={`/project/${projectId}`} 
            className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium"
          >
            View Commits
          </Link>
        </div>

        {!sourceFiles || sourceFiles.length === 0 ? (
          <div className="bg-white/10 p-6 rounded-xl">
            <p className="text-xl">No source code files have been indexed for this project yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-xl md:col-span-1 h-[calc(100vh-240px)] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Files</h2>
              
              <div className="space-y-2">
                {sourceFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedFile?.id === file.id
                        ? "bg-purple-700"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <p className="text-sm font-medium truncate">{file.fileName}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl md:col-span-2 h-[calc(100vh-240px)] overflow-y-auto">
              {selectedFile ? (
                <>
                  <h2 className="text-xl font-bold mb-2">{selectedFile.fileName}</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">Summary</h3>
                    <p className="text-gray-200 bg-white/5 p-4 rounded-lg">
                      {selectedFile.summary}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">Source Code</h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{selectedFile.sourceCode}</code>
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Select a file to view its summary and source code</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 