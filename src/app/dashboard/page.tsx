"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { skipToken } from "@tanstack/react-query";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
}

interface Project {
  id: string;
  name: string;
  githubUrl: string;
}

interface CustomUser {
  githubUsername?: string;
  githubToken?: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [indexingStatus, setIndexingStatus] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  
  // tRPC hooks
  const createProjectMutation = api.project.createProject.useMutation({
    onSuccess: () => {
      setIndexingStatus("Repository indexed successfully!");
      setLoading(false);
    },
    onError: (error: any) => {
      setIndexingStatus(`Error: ${error.message}`);
      setLoading(false);
    }
  });
  
  const { data: projects } = api.project.getProjects.useQuery(undefined, {
    enabled: !!session,
  });
  
  // GitHub repos query
  const { data: githubRepos, isLoading: isLoadingRepos } = api.github.getUserRepos.useQuery(
    username ? { username } : skipToken,
    { enabled: !!username }
  );

  // Update repositories when data changes
  useEffect(() => {
    if (githubRepos) {
      setRepositories(githubRepos as Repository[]);
      setLoading(false);
    }
  }, [githubRepos]);

  // Initialize username when session loads
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    
    if (session?.user && (session.user as CustomUser).githubUsername) {
      setLoading(true);
      setUsername((session.user as CustomUser).githubUsername!);
    }
  }, [status, session, router]);

  const handleRepoSelection = (repoUrl: string) => {
    setSelectedRepo(repoUrl);
  };

  const handleGenerateSummary = async () => {
    if (!selectedRepo) return;
    
    try {
      setLoading(true);
      setIndexingStatus("Indexing repository. This may take a few minutes...");
      
      // Extract repo name from the URL
      const repoName = selectedRepo.split('/').pop() || selectedRepo;
      
      await createProjectMutation.mutateAsync({
        name: repoName,
        githubUrl: selectedRepo,
        githubToken: (session?.user as CustomUser).githubToken || undefined,
      });
      
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setIndexingStatus("Failed to generate summary");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Repository Dashboard</h1>
        
        {status === "loading" ? (
          <div className="text-center">Loading user data...</div>
        ) : (
          <>
            <div className="bg-white/10 p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-bold mb-4">Your GitHub Repositories</h2>
              
              {(loading || isLoadingRepos) && !repositories.length ? (
                <div className="text-center">Loading repositories...</div>
              ) : (
                <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
                  {repositories.map((repo) => (
                    <div
                      key={repo.id}
                      className={`p-4 rounded-lg cursor-pointer ${
                        selectedRepo === repo.html_url
                          ? "bg-purple-700"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                      onClick={() => handleRepoSelection(repo.html_url)}
                    >
                      <h3 className="font-bold">{repo.name}</h3>
                      <p className="text-sm text-gray-300">{repo.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={handleGenerateSummary}
                disabled={!selectedRepo || loading}
                className="mt-6 px-6 py-2 bg-purple-600 rounded-lg font-medium disabled:opacity-50"
              >
                Generate Summary
              </button>
              
              {indexingStatus && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  {indexingStatus}
                </div>
              )}
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Indexed Projects</h2>
              
              {!projects?.length ? (
                <p>No projects indexed yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((project: Project) => (
                    <div key={project.id} className="bg-white/5 p-4 rounded-lg">
                      <h3 className="font-bold">{project.name}</h3>
                      <p className="text-sm text-gray-300">{project.githubUrl}</p>
                      <button 
                        onClick={() => router.push(`/project/${project.id}`)}
                        className="mt-2 px-4 py-1 bg-purple-600 rounded-lg text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
} 