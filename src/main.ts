import "dotenv/config";

import fs from "node:fs";
import path from "path";
import cliProgress from "cli-progress";

import { GitHubApi } from "./lib/Github.lib";
import FooterGenerator from "./footer-generator";

const { pathname: __dirname } = new URL('../src', import.meta.url)

const cliParams: any[] = process.argv.slice(2);

const useLocalFile: boolean = !!cliParams.find((i) => /--use-local/.test(i));
const useLocalFileIndex: number = cliParams.findIndex((i) => /--use-local/.test(i));
const useLocalCommand: string = cliParams[useLocalFileIndex];

const [, localFilename = "footer.md"] = (useLocalCommand || "").split("=");

const localFileExists = fs.existsSync(path.resolve(__dirname, `./${localFilename}`))
if (!localFileExists) {
  throw new Error("Local file should exists. Take a look to the parameter `--use-local` and try again!");
}

const repoParamIndex: number = cliParams.findIndex((i) => /--repo/.test(i));
const repoNameCommand: string = cliParams[repoParamIndex];
const [, repo] = (repoNameCommand || "").split("=");

if (!repo) {
  throw new Error("Repository name is mandatory!");
}

const useRegexIndex: number = cliParams.findIndex((i) => /--use-regex/.test(i));
const useRegexCommand: string = cliParams[useRegexIndex];
const [, regex] = (useRegexCommand || "").split("=");

const { GITHUB_ACCESS_TOKEN, GITHUB_USERNAME } = process.env;

if (!GITHUB_ACCESS_TOKEN) {
  throw new Error("Set your GITHUB_ACCESS_TOKEN in your environment vars!");
}

if (!GITHUB_USERNAME) {
  throw new Error("Set your OWNER in your environment vars!");
}

const owner: string = GITHUB_USERNAME;

const stepProgress = Math.floor(100 / 7);
let currentStepProgress = 0;

const run = async () => {
  const progress = new cliProgress.SingleBar({
    format: "{bar} | {percentage}% - {state}"
  }, cliProgress.Presets.shades_classic);

  const github = new GitHubApi(GITHUB_ACCESS_TOKEN);

  progress.start(100, currentStepProgress, {
    state: "Getting readme",
    bar: currentStepProgress,
    percentage: currentStepProgress
  });

  // Get readme content and path
  const readmeData = await github.getReadme({ owner, repo });
  if (!readmeData) {
    return;
  }
  const readmeContent = readmeData.content;
  const readmePath = readmeData.path;
  // !

  currentStepProgress += stepProgress;
  progress.update(currentStepProgress, {
    state: "Getting default branch",
    percentage: currentStepProgress
  });

  // Get default branch
  const repoInfo = await github.getRepoInfo({ owner, repo });
  if (!repoInfo) {
    return;
  }
  const defaultBranch = repoInfo.default_branch;
  // !

  // Create new readme content
  const buff = Buffer.from(readmeContent as string, "base64");
  const text = buff.toString("utf-8");

  currentStepProgress += stepProgress
  progress.update(currentStepProgress, {
    state: "Getting my professional data",
    percentage: currentStepProgress
  });

  let newContent = text.replace(new RegExp(regex, 'g'), '').trim();

  if (useLocalFile) {
    newContent = `${newContent}\n\n${fs.readFileSync(
      path.resolve(__dirname, `./${localFilename}`), { encoding: "utf8" }
    )}`;
  } else {
    newContent = await FooterGenerator(newContent);
  }

  const files = [{
    path: readmePath,
    content: newContent
  }];

  currentStepProgress += stepProgress;
  progress.update(currentStepProgress, {
    state: "Updating new readme",
    percentage: currentStepProgress
  });

  // Pre-Create new git tree
  const lastBranchCommit = await github.getCommit({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
  });
  if (!lastBranchCommit) {
    return;
  };

  const lastCommitSha = lastBranchCommit.sha;

  currentStepProgress += stepProgress
  progress.update(currentStepProgress, {
    state: "Updating new readme",
    percentage: currentStepProgress
  });

  let treeFiles: any[] = [];
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    const blobFile = await github.createBlob({
      owner,
      repo,
      content: file.content,
    });

    if (!blobFile) {
      return;
    }

    treeFiles.push({
      blobSha: blobFile.sha,
      ...file,
    });
  }

  const tree = treeFiles.map((file) => ({
    path: file.path,
    mode: file.mode || "100644",
    type: file.type || "blob",
    sha: file.sha || file.blobSha,
  }));
  // !

  currentStepProgress += stepProgress;
  progress.update(currentStepProgress, {
    state: "Updating new readme",
    percentage: currentStepProgress
  });

  // Create new tree
  const newTree = await github.createTree({
    owner,
    repo,
    base_tree: lastCommitSha,
    tree,
  });

  if (!newTree) {
    return;
  }
  // !

  const newTreeSha = newTree.sha;

  // Create commit
  const newCommit: any = await github.createCommit({
    owner,
    repo,
    message: `chore: update readme [${Date.now()}]`,
    tree: newTreeSha,
    parents: [lastCommitSha],
  });

  currentStepProgress += stepProgress
  progress.update(currentStepProgress, {
    state: "Updating new readme",
    percentage: currentStepProgress
  });

  if (!newCommit) {
    return;
  }
  // !

  currentStepProgress += stepProgress;
  progress.update(currentStepProgress, {
    state: "Updating new readme",
    percentage: currentStepProgress
  });

  // Push new commit with the new content
  const lastRef = await github.updateRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
    sha: newCommit.sha,
  });

  if (!lastRef) {
    return;
  }
  // !

  progress.update(100, {
    state: "Done! 🎉",
    percentage: 100
  });

  progress.stop();

  console.log(`\nReadme updated with the last changes.
	Visit changes here: https://github.com/${owner}/${repo}/commit/${newCommit.sha}
	Visit repository here: https://github.com/${owner}/${repo}/${readmePath}`);
};

run();
