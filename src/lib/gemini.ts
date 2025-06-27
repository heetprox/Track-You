import { GoogleGenerativeAI } from "@google/generative-ai"
import { Document } from "@langchain/core/documents";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genai.getGenerativeModel({
    model: "gemini-2.5-flash",
});

export const aiSummarize = async (diff: string) => {
    const prompt = `You are an expert programmer, and you are trying to summarize a git diff.
    Reminders about the git diff format:
    For every file, there are a few metadata lines, like (for example):
    \`\`\`
    diff --git a/lib/index.js b/lib/index.js
    index aadf691..bfef603 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \`\`\`
    This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
    Then there is a specifier of the lines that were modified.
    A line starting with \`+\` means it was added.

    A line that starting with \`-\` means that line was deleted.
    A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.

     EXAMPLE SUMMARY COMMENTS:
       \`\`\`
    * Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
    * Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
    * Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
    * Added an GEMINI API for completions [packages/utils/apis/gemini.ts]
    * Lowered numeric tolerance for test files
        \`\`\`
    Most commits will have less comments than this examples list.
    The last comment does not include the file names,
    because there were more than two relevant files in the hypothetical commit.
    Do not include parts of the example in your summary.
    It is given only as an example of appropriate comments

    Please summarise the following diff file: \n\n${diff}
    `;

    const response = await model.generateContent(prompt);
    return response.response.text();
}

export const summarizeCode = async (doc: Document) => {
    console.log("getting summary for :", doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0, 10000);
        const response = await model.generateContent([
            `You are an intelligent senior software engineer who specialise in onboarding junior software engineers onto projects`,
            `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file
            here is the code:
            ---
            ${code}
            ---
            give a summary no more than 100 words of the code above`
        ]);
        return response.response.text();
    } catch (error) {
        return 'error in summarize code';
    }

}


export const generateEmbedding = async (summary: string) => {
        const model = genai.getGenerativeModel({
            model: "text-embedding-004",
        });

        const response = await model.embedContent(summary);
        const embedding = response.embedding;
        return embedding.values;
    }
