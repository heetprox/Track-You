"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { skipToken } from "@tanstack/react-query";
import Link from "next/link";

interface Commit {
  id: string;
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: Date | string;
  summary: string;
}

export default function ProjectPage() {
  const { id } = useParams();
  const projectId = typeof id === 'string' ? id : undefined;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(2);

  // Fetch commits for the selected project
  const { data: commits, refetch } = api.project.getCommits.useQuery(
    projectId ? { projectId } : skipToken,
    {
      enabled: !!projectId && !!session,
    }
  );

  // Update loading state when data comes in
  useEffect(() => {
    if (commits !== undefined) {
      setLoading(false);
    }
  }, [commits]);

  const fetchMoreMutation = api.project.getNextCommits.useMutation({
    onSuccess: async () => {
      await refetch();
      setLoadingMore(false);
    },
  });

  // Load more commits
  const handleLoadMore = async () => {
    if (!projectId || loadingMore) return;
    
    setLoadingMore(true);
    try {
      await fetchMoreMutation.mutateAsync({
        projectId,
        page,
      });
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Failed to load more commits:", error);
      setLoadingMore(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center">
          <p>Loading project data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Project Summary</h1>

        <div className="mb-6 flex gap-4">
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>

          <Link 
            href={`/project/${projectId}/source`} 
            className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium"
          >
            Source Code Insights
          </Link>
        </div>

        {!commits || commits.length === 0 ? (
          <div className="bg-white/10 p-6 rounded-xl">
            <p className="text-xl">No commits found for this project.</p>
          </div>
        ) : (
          <div className="bg-white/10 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Commit Summaries</h2>
            
            <div className="space-y-6">
              {commits.map((commit) => (
                <div key={commit.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center gap-4 mb-2">
                    {commit.commitAuthorAvatar && (
                      <img 
                        src={commit.commitAuthorAvatar}
                        alt={commit.commitAuthorName}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-bold">{commit.commitAuthorName}</h3>
                      <p className="text-sm text-gray-300">
                        {new Date(commit.commitDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <h4 className="font-semibold text-purple-300">Message</h4>
                    <p className="text-sm mb-3">{commit.commitMessage}</p>
                    
                    <h4 className="font-semibold text-purple-300">AI Summary</h4>
                    <p className="text-sm whitespace-pre-line">{commit.summary}</p>
                    
                    <div className="mt-2 text-xs text-gray-400">
                      Commit: {commit.commitHash.substring(0, 7)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2 bg-purple-600 rounded-lg font-medium disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load More Commits"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 