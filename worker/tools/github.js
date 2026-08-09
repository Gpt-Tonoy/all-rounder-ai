// =========================================
// GitHub Tool - Branch + PR workflow (never touches main directly)
// =========================================

const GITHUB_API = "https://api.github.com";
const OWNER = "Gpt-Tonoy";
const REPO = "all-rounder-ai";

async function githubFetch(env, path, options = {}) {

  return fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "All-Rounder-AI-Agent",
      Accept: "application/vnd.github+json",
      ...(options.headers || {}),
    },
  });

}

async function getBranchSha(env, branch) {

  const res = await githubFetch(env, `/repos/${OWNER}/${REPO}/git/ref/heads/${branch}`);

  if (!res.ok) {
    throw new Error(`Failed to read branch "${branch}": ${res.status}`);
  }

  const data = await res.json();
  return data.object.sha;

}

export async function createBranch(env, newBranch, baseBranch = "main") {

  const baseSha = await getBranchSha(env, baseBranch);

  const res = await githubFetch(env, `/repos/${OWNER}/${REPO}/git/refs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ref: `refs/heads/${newBranch}`,
      sha: baseSha,
    }),
  });

  if (res.status === 422) {
    // Branch already exists - fine, reuse it
    return baseSha;
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create branch "${newBranch}": ${res.status} - ${err}`);
  }

  return baseSha;

}

async function getFileSha(env, path, branch) {

  const res = await githubFetch(
    env,
    `/repos/${OWNER}/${REPO}/contents/${path}?ref=${branch}`
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`GitHub read failed for "${path}": ${res.status}`);
  }

  const data = await res.json();
  return data.sha;

}

export async function commitFile(env, path, content, message, branch) {

  const sha = await getFileSha(env, path, branch);

  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const res = await githubFetch(env, `/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit failed for "${path}": ${res.status} - ${err}`);
  }

  return await res.json();

}

export async function createPullRequest(env, branch, title, body, baseBranch = "main") {

  const res = await githubFetch(env, `/repos/${OWNER}/${REPO}/pulls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      head: branch,
      base: baseBranch,
      body,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create pull request: ${res.status} - ${err}`);
  }

  return await res.json();

}
