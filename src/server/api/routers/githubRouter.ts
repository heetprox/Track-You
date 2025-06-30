import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const githubRouter = createTRPCRouter({
  getUserRepos: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { username } = input;

      try {
        // Use user's github token if available
        const userToken = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { githubToken: true }
        });
        
        const GITHUB_TOKEN = userToken?.githubToken || process.env.GITHUB_TOKEN;

        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json'
        };
        
        if (GITHUB_TOKEN) {
          headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
        }

        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });

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