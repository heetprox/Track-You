import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";

import { db } from "@/server/db";

// Ensure db is initialized
console.log("Database connection status:", !!db);

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    signIn: async ({ user, account, profile }) => {
      // Normal flow - update user data
      if (user.id) {
        try {
          if (account?.provider === 'github') {
            // Extract GitHub profile data
            const githubProfile = profile as any;
            
            // Debug GitHub profile data
            console.log("GitHub profile data:", {
              id: githubProfile?.id,
              login: githubProfile?.login,
              name: githubProfile?.name, 
              avatar_url: githubProfile?.avatar_url
            });
            
            // Get the GitHub username (login is the actual username)
            const githubUsername = githubProfile?.login || githubProfile?.name;
            
            await db.user.update({
              where: { id: user.id },
              data: {
                // Copy standard fields to our custom fields if needed
                emailAddress: user.email,
                imageUrl: githubProfile?.avatar_url || user.image, // Use GitHub avatar if available
                // GitHub specific data
                githubId: profile?.id?.toString(),
                githubUsername: githubUsername,
                githubToken: account?.access_token,
                githubRefreshToken: account?.refresh_token,
              },
            });
          }
          
          // Store Twitter/X snowflake ID
          if (account?.provider === 'twitter' && profile) {
            // Get the Twitter profile data
            const twitterProfile = profile as any;
            const snowflakeId = twitterProfile.id_str;
            
            if (snowflakeId) {
              // Debug the Twitter profile data
              console.log("Twitter profile data:", {
                id_str: twitterProfile.id_str,
                profile_image_url_https: twitterProfile.profile_image_url_https
              });
              
              // Extract image filename from url (but remove the _normal part)
              let imageFilename = "profile_400x400.jpg"; // Default filename
              
              if (twitterProfile.profile_image_url_https) {
                const urlParts = twitterProfile.profile_image_url_https.split('/');
                const originalFilename = urlParts[urlParts.length - 1];
                // Get base filename without _normal part
                const baseFilename = originalFilename.replace('_normal', '');
                // Extract just the filename without extension
                const filenameWithoutExt = baseFilename.split('.')[0];
                // Build 400x400 filename
                imageFilename = `${filenameWithoutExt}_400x400.jpg`;
                console.log("Original filename:", originalFilename);
                console.log("Using filename:", imageFilename);
              }
              
              // Directly construct high-res URL using Twitter ID and 400x400 format
              const imageUrl = `https://pbs.twimg.com/profile_images/${snowflakeId}/${imageFilename}`;
              
                              await db.user.update({
                where: { id: user.id },
                data: {
                  // Store the snowflake ID and high-res image URL
                  imageUrl: imageUrl,
                  // Type assertion to fix missing property error
                  ...(snowflakeId && { twitterId: snowflakeId } as any)
                },
              });
            }
          }
        } catch (error) {
          console.error("Error updating user data:", error);
          // Don't block signin on error
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
