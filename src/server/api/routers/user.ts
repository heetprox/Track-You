import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        imageUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          imageUrl: input.imageUrl,
        },
      });
    }),

  // Save GitHub credentials
  saveGithubCredentials: protectedProcedure
    .input(
      z.object({
        githubId: z.string(),
        githubToken: z.string(),
        githubRefreshToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          githubId: input.githubId,
          githubToken: input.githubToken,
          githubRefreshToken: input.githubRefreshToken,
        },
      });
    }),

  // Get all users (admin only - this would need additional role-based checks)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
}); 