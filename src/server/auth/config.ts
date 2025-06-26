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
    // Remove Twitter provider temporarily until we diagnose the issue
    // TwitterProvider({
    //   clientId: process.env.AUTH_TWITTER_ID,
    //   clientSecret: process.env.AUTH_TWITTER_SECRET,
    // }),
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
      if (!user.email) return true;
      
      try {
        // Update or create user with provider specific data
        await db.user.upsert({
          where: { id: user.id },
          update: {
            emailAddress: user.email,
            name: user.name,
            imageUrl: user.image,
            ...(account?.provider === 'github' && {
              githubId: profile?.id?.toString(),
              githubToken: account?.access_token,
              githubRefreshToken: account?.refresh_token,
            }),
          },
          create: {
            id: user.id,
            emailAddress: user.email,
            name: user.name,
            imageUrl: user.image,
            ...(account?.provider === 'github' && {
              githubId: profile?.id?.toString(),
              githubToken: account?.access_token,
              githubRefreshToken: account?.refresh_token,
            }),
          },
        });
        return true;
      } catch (error) {
        console.error("Error saving user data:", error);
        return true; // Still allow sign in even if saving extra data fails
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
