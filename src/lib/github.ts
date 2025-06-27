import { db } from "@/server/db";
import { Octokit } from "octokit";
import { aiSummarize } from "@/lib/gemini";
import axios from "axios";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});


type Response = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}

export const getCommits = async (githubUrl: string, page = 1, per_page = 30): Promise<Response[]> => {
    const urlParts = githubUrl.split("/");
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];
    
    if (!owner || !repo) {
        throw new Error("Invalid GitHub URL");
    }
    
    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo,
        page,
        per_page,
    });

    const sortedCommits = data.sort((a, b) => {
        const dateA = a.commit.author?.date || '';
        const dateB = b.commit.author?.date || '';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });


    return sortedCommits.map((commit) => ({
        commitHash: commit.sha,
        commitMessage: commit.commit.message,
        commitAuthorName: commit.commit.author?.name || '',
        commitAuthorAvatar: commit.author?.avatar_url || '',
        commitDate: commit.commit.author?.date || '',
    }));
};

export const pollCommits = async (projectId: string, page = 1) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
    if (!githubUrl) {
        throw new Error("GitHub URL not found");
    }
    
    const commitHashes = await getCommits(githubUrl, page);
    const unprocessedCommits = await filterUnProcessedCommits(projectId, commitHashes);

    if (unprocessedCommits.length === 0) {
        return; // Exit if no new commits to process
    }

    const summariesResponses = await Promise.allSettled(unprocessedCommits.map(async (commit) => {
        return await summarizeCommits(githubUrl, commit.commitHash);
    }));

    const summaries = summariesResponses.map((response) => {
        if (response.status === "fulfilled") {
            return response.value as string;
        }
        return "No summary available";
    });

    return await db.commit.createMany({
        data: summaries.map((summary, index) => ({
            projectId,
            commitHash: unprocessedCommits[index]!.commitHash,
            commitMessage: unprocessedCommits[index]!.commitMessage,
            commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
            commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
            commitDate: unprocessedCommits[index]!.commitDate,
            summary,
        })),
    });
};

const summarizeCommits = async (githubUrl:string, commitHash: string) => {
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
        headers: {
            "Accept": "application/vnd.github.v3.fiff",
        },
    });
    
    return await aiSummarize(data) || "No summary available";
}


async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            githubUrl: true,
        },
    });
    return { project, githubUrl: project?.githubUrl };
}

async function filterUnProcessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: { projectId },
    });
    const unProcessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash));
    return unProcessedCommits;
}


// await pollCommits("cm6wc7o0r000011h7hiv7dipj").then(console.log);
// console.log("done");