"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTwitter, FaGithub, FaUser, FaEdit, FaSave, FaTimes, FaImage } from "react-icons/fa";

import { api } from "@/trpc/react";
import Image from "next/image";
import LinkGitHubButton from "@/app/_components/link-github-button";

// Type for user data
type UserData = {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  emailAddress?: string | null;
  imageUrl?: string | null;
  githubId?: string | null;
  githubUsername?: string | null;
  twitterId?: string | null;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any; // For any other properties
};

// Generate initials placeholder image
function getInitialsPlaceholder(name: string | null | undefined): string {
  if (!name) return '';
  
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Generate a consistent but random-ish color based on the name
  const hue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  const bgColor = `hsl(${hue}, 70%, 60%)`;
  
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="background-color: ${bgColor};"><text x="50" y="50" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="white">${initials}</text></svg>`;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  
  // Get current user data
  const { data: user, isLoading, refetch } = api.user.getCurrent.useQuery();
  
  // Update profile mutation
  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      void refetch();
    },
  });

  // Helper function to get the best available image URL
  const getProfileImageUrl = (user?: UserData | null): string | null => {
    if (!user) return null;
    
    // Check all possible image locations in order of preference
    
    // If we have stored a custom imageUrl (which should already be 400x400 for Twitter)
    if (user.imageUrl) return user.imageUrl;
    
    // If we have the Twitter ID, construct the high-res URL directly
    if (user.twitterId) {
      return `https://pbs.twimg.com/profile_images/${user.twitterId}/profile_400x400.jpg`;
    }
    
    // Fallback to standard image field
    if (user.image) {
      // If it's a Twitter image, upgrade to 400x400 resolution
      if (user.image.includes('twimg.com')) {
        return user.image.replace('_normal', '_400x400');
      }
      return user.image;
    }
    
    return null; // No image available
  };

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setImageUrl(getProfileImageUrl(user) ?? "");
      setImageError(false);
      
      // Debug
      console.log("User data:", user);
      console.log("Image URL:", getProfileImageUrl(user));
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
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-4 w-4 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-4 w-4 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Loading profile data...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  // Determine user's social account type
  const hasTwitter = !!user.email?.includes("twitter") || user.image?.includes("twimg") || !!user.twitterId;
  const hasGithub = !!user.githubId;

  // Debug - log user data
  console.log("User data:", {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    twitterId: user.twitterId,
    githubId: user.githubId,
    githubUsername: (user as any).githubUsername,
    imageUrl: user.imageUrl
  });
  
  // Get Twitter username (based on standard patterns in Twitter emails)
  const getTwitterUsername = () => {
    if (user.name) {
      // Remove spaces and convert to lowercase for a possible username
      return user.name.replace(/\s+/g, '').toLowerCase();
    }
    return null;
  };
  
  const twitterUsername = getTwitterUsername();
  const profileImage = getProfileImageUrl(user);
  const placeholderImage = getInitialsPlaceholder(user.name);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col items-center w-full max-w-lg">
          {!isEditing && (
            <div className="relative w-full">
              <div className="absolute h-32 w-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-xl"></div>
              <div className="relative pt-16 px-8 flex flex-col items-center">
                <div className="ring-4 ring-white/10 rounded-full overflow-hidden h-28 w-28 shadow-xl transform -translate-y-1/2">
                  {!imageError && profileImage ? (
                    <Image
                      src={profileImage}
                      alt={user.name ?? "User"}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : placeholderImage ? (
                    <img
                      src={placeholderImage}
                      alt={user.name ?? "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-purple-400 flex items-center justify-center">
                      <FaUser size={40} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl w-full shadow-xl">
            {isEditing ? (
              // Edit mode
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center">Edit Profile</h2>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-white/60 mt-1">
                    <FaImage className="inline mr-1" /> 
                    If your Twitter image is blocked, paste a different image URL or leave empty to use the initials avatar.
                  </p>
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 rounded-md flex items-center gap-2 hover:bg-gray-500 transition"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-purple-600 rounded-md flex items-center gap-2 hover:bg-purple-500 transition"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? "Saving..." : <><FaSave /> Save</>}
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
                  <p className="text-white/70 mb-4">{user.emailAddress || user.email}</p>
                  
                  {/* Social Links */}
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {hasTwitter && twitterUsername && (
                      <a 
                        href={`https://twitter.com/${twitterUsername}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 rounded-full transition"
                      >
                        <FaTwitter className="text-[#1DA1F2]" /> 
                        <span className="text-blue-200">@{twitterUsername}</span>
                      </a>
                    )}
                    
                    {hasGithub && (
                      <a 
                        href={(user as any).githubUsername ? `https://github.com/${(user as any).githubUsername}` : user.githubId ? `https://github.com/id/${user.githubId}` : "https://github.com"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-1.5 bg-gray-700/30 hover:bg-gray-700/50 rounded-full transition"
                      >
                        <FaGithub className="text-white" /> 
                        <span className="text-gray-200">{(user as any).githubUsername || user.githubId || "GitHub Profile"}</span>
                      </a>
                    )}
                  </div>
                </div>

                {imageError && (
                  <div className="bg-yellow-800/30 border border-yellow-700/30 rounded-lg p-3 text-sm text-white/80">
                    <p className="flex items-center gap-2">
                      <FaImage className="text-yellow-500" /> Your Twitter profile image was blocked by your browser. 
                      You can edit your profile to add a different image URL.
                    </p>
                  </div>
                )}

                {/* Debug section - only visible in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs text-white/60">
                    <p>Debug - Image URL: {profileImage || 'No image URL available'}</p>
                    <p>Image Error: {imageError ? 'Yes' : 'No'}</p>
                  </div>
                )}
                
                {/* GitHub connection section - show only if user has Twitter but not GitHub */}
                {hasTwitter && !hasGithub && (
                  <LinkGitHubButton />
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Account Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-white/70">Account Type</div>
                    <div className="flex items-center">
                      {hasTwitter && <FaTwitter className="text-[#1DA1F2] mr-2" />}
                      {hasGithub && <FaGithub className="mr-2" />}
                      {!hasTwitter && !hasGithub && "Standard"}
                      {hasTwitter && "Twitter"}
                      {hasGithub && "GitHub"}
                    </div>
                    
                    <div className="text-white/70">Accounts Connected</div>
                    <div className="flex flex-col gap-2">
                      {hasTwitter && (
                        <a 
                          href={twitterUsername ? `https://twitter.com/${twitterUsername}` : "https://twitter.com"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 rounded px-3 py-1.5 text-xs mr-1 transition"
                        >
                          <FaTwitter className="mr-2" /> 
                          {twitterUsername ? `@${twitterUsername}` : "Twitter Profile"}
                          <span className="ml-1 opacity-70">↗</span>
                        </a>
                      )}
                      {hasGithub && (
                        <a 
                          href={(user as any).githubUsername ? `https://github.com/${(user as any).githubUsername}` : "https://github.com"}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="inline-flex items-center bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded px-3 py-1.5 text-xs transition"
                        >
                          <FaGithub className="mr-2" /> 
                          {(user as any).githubUsername ? (user as any).githubUsername : (user.githubId ? "GitHub ID: " + user.githubId : "GitHub Profile")}
                          <span className="ml-1 opacity-70">↗</span>
                        </a>
                      )}
                    </div>
                    
                    <div className="text-white/70">Profile Image</div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs">
                        {user.twitterId && "Twitter image available"}
                        {user.githubId && hasGithub && ", GitHub image available"}
                      </div>
                    </div>
                    
                    <div className="text-white/70">Credits</div>
                    <div className="font-mono">{user.credits}</div>
                    
                    <div className="text-white/70">Member Since</div>
                    <div>{new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => router.push("/")}
                    className="px-5 py-2 bg-white/10 rounded-md hover:bg-white/20 transition"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-md hover:opacity-90 transition flex items-center gap-2"
                  >
                    <FaEdit /> Edit Profile
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