import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";

type Readme = Endpoints["GET /repos/{owner}/{repo}/readme"]["response"]["data"] | undefined;
type RepositoryInfo = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"] | undefined;
type Commit = Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"]["data"] | undefined;
type Blob = Endpoints["POST /repos/{owner}/{repo}/git/blobs"]["response"]["data"] | undefined;
type Tree = Endpoints["POST /repos/{owner}/{repo}/git/trees"]["response"]["data"] | undefined;
type CommitCreated = Endpoints["POST /repos/{owner}/{repo}/git/commits"]["response"]["data"] | undefined;
type RefUpdated = Endpoints["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]["response"]["data"] | undefined;

type MandatoryParams = {
	owner: string;
	repo: string;
}

export class GitHubApi {
	private static instance: GitHubApi | null = null;
	private static github: Octokit;

	constructor(token?: string) {
		if (token) {
			this.create(token);
		}
		if (!GitHubApi.instance) {
			GitHubApi.instance = this;
		}
	}

	public create(token?: string): void {
		GitHubApi.github = new Octokit({
			auth: token,
		});
	}

	public async getReadme({ owner, repo }: MandatoryParams): Promise<Readme> {
		try {
			const { data } = await GitHubApi.github.request("GET /repos/{owner}/{repo}/readme", {
				owner,
				repo,
			});

			return data;
		} catch (error: any) {
			console.error("Info [GitHubApi > getReadme]:", error.message);

			throw new Error(error.message);
		}
	}

	public async getRepoInfo({ owner, repo }: MandatoryParams): Promise<RepositoryInfo> {
		try {
			const { data } = await GitHubApi.github.request("GET /repos/{owner}/{repo}", {
				owner,
				repo,
			});

			return data;
		} catch (error: any) {
			console.error("Info [GitHubApi > getRepoInfo]:", error.message);

			throw new Error(error.message);
		}
	}

	public async getCommit(
		{ owner, repo, ref = "heads/master" }: MandatoryParams & { ref: string }
	): Promise<Commit> {
		try {
			const { data } = await GitHubApi.github.request("GET /repos/{owner}/{repo}/commits/{ref}", {
				owner,
				repo,
				ref,
			});

			return data;
		} catch (error: any) {
			console.error("Info [GitHubApi > getCommit]:", error.message);

			throw new Error(error.message);
		}
	}

	public async createBlob(
		{ owner, repo, content }: MandatoryParams & { content: string }
	): Promise<Blob> {
		try {
			const { data } = await GitHubApi.github.request("POST /repos/{owner}/{repo}/git/blobs", {
				owner,
				repo,
				content,
			});

			return data;
		} catch (error: any) {
			console.error("Info [GitHubApi > createBlob]:", error.message);

			throw new Error(error.message);
		}
	}

	public async createTree(
		{ owner, repo, base_tree, tree }: MandatoryParams & { base_tree: string; tree: any[] }
	): Promise<Tree> {
		try {
			const { data } = await GitHubApi.github.request(
				"POST /repos/{owner}/{repo}/git/trees?recursive=1",
				{
					owner,
					repo,
					// eslint-disable-next-line camelcase
					base_tree,
					tree,
				}
			);

			return data;
		} catch (error: any) {
			console.error("Info [GitHubApi > createTree]:", error.message);

			throw new Error(error.message);
		}
	}

	public async createCommit(
		{ owner, repo, message, tree, parents }:
			MandatoryParams & { message: string; tree: string; parents: string[]; }
	): Promise<CommitCreated> {
		try {
			const { data } = await GitHubApi.github.request("POST /repos/{owner}/{repo}/git/commits", {
				owner,
				repo,
				message,
				tree,
				parents,
			});

			return data;
		} catch (error: any) {
			console.error("Info [GitHubApi > createCommit]:", error.message);

			throw new Error(error.message);
		}
	}

	public async updateRef(
		{ owner, repo, ref = "heads/master", sha, force = false }:
			MandatoryParams & { ref: string; sha: string; force?: boolean; }
	): Promise<RefUpdated> {
		try {
			const { data } = await GitHubApi.github.request(
				"PATCH /repos/{owner}/{repo}/git/refs/{ref}",
				{
					owner,
					repo,
					ref,
					sha,
					force,
				}
			);

			return data;
		} catch (error: any) {
			console.error("Info [GitHubApi > updateRef]:", error.message);

			throw new Error(error.message);
		}
	}
}