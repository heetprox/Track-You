"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/trpc/react";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Get current user data
  const { data: user, isLoading, refetch } = api.user.getCurrent.useQuery();
  
  // Update profile mutation
  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      void refetch();
    },
  });

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setImageUrl(user.imageUrl ?? "");
    }
  }, [user]);

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    await updateProfile.mutate({
      name,
      imageUrl,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-4xl font-extrabold tracking-tight">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col items-center w-full max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight mb-8">Your Profile</h1>
          
          <div className="bg-white/10 p-8 rounded-xl w-full">
            {isEditing ? (
              // Edit mode
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                  />
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-purple-600 rounded-md"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center">
                  {user.imageUrl && (
                    <img
                      src={user.imageUrl}
                      alt={user.name ?? "User"}
                      className="w-24 h-24 rounded-full mb-4"
                    />
                  )}
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-white/70">{user.emailAddress}</p>
                </div>

                <div className="mt-2">
                  <h3 className="text-lg font-semibold mb-2">Account Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-white/70">Account Type</div>
                    <div>{user.githubId ? "GitHub" : "Standard"}</div>
                    
                    <div className="text-white/70">Credits</div>
                    <div>{user.credits}</div>
                    
                    <div className="text-white/70">Member Since</div>
                    <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 bg-white/10 rounded-md"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-purple-600 rounded-md"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 