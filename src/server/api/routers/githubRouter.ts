import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const githubRouter = createTRPCRouter({
  getUserRepos: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { username } = input;

      try {
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Securely stored in the backend

        const headers: HeadersInit = {};
        if (GITHUB_TOKEN) {
          headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
        }

        const response = await fetch(`https://api.github.com/users/${username}/repos`, { headers });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error('GitHub API Error:', err);
        throw new Error('Failed to fetch repositories');
      }
    }),
});