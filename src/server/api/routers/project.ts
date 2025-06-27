import { pollCommits } from "@/lib/github";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure
        .input(z.object({
            name: z.string().min(1, "Project name is required"),
            githubUrl: z.string()
                .url("Must be a valid URL")
                .regex(/^https?:\/\/(?:www\.)?github\.com\/.+\/.+/i, "Must be a valid GitHub repository URL"),
            githubToken: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    id: ctx.session.user.id
                }
            })
            console.log('userr : ', user)
            if (!user) {
                throw new Error("User not found");
            }
            console.log('userr : ', user)
            const project = await ctx.db.project.create({
                data: {
                    name: input.name,
                    githubUrl: input.githubUrl,
                    userToProjects: {
                        create: {
                            userId: ctx.session.user.id
                        }
                    }
                }
            });
            await pollCommits(project.id);
            await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
            return project;
        }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {

        return await ctx.db.project.findMany({
            where: {
                userToProjects: {
                    some: {
                        userId: ctx.session.user.id
                    }
                },
                deletedAt: null
            }
        });

        
    }),
    getCommits: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        pollCommits(input.projectId).then().catch(console.error);
        return await ctx.db.commit.findMany({
            where: { projectId: input.projectId }
        });
    }),
    getNextCommits: protectedProcedure.input(z.object({
        projectId: z.string(),
        page: z.number().default(2)
    })).mutation(async ({ ctx, input }) => {
        await pollCommits(input.projectId, input.page);
        return await ctx.db.commit.findMany({
            where: { projectId: input.projectId }
        });
    }),
    syncUser: protectedProcedure
        .mutation(async ({ ctx }) => {
            const user = await ctx.db.user.upsert({
                where: { id: ctx.session.user.id },
                create: { 
                    id: ctx.session.user.id,
                },
                update: {}
            });
            return user;
        }),
});


