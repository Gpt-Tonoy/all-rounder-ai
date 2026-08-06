// =========================================
// GitHub Tool - Commit files directly to repo
// =========================================

const GITHUB_API = "https://api.github.com";
const OWNER = "Gpt-Tonoy";
const REPO = "all-rounder-ai";

async function getFileSha(env, path) {

  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "User-Agent": "All-Rounder-AI-Agent",
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`GitHub read failed: ${res.status}`);
  }

  const data = await res.json();
  return data.sha;

}

export async function commitFile(env, path, content, message) {

  const sha = await getFileSha(env, path);

  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: "main",
  };

  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "User-Agent": "All-Rounder-AI-Agent",
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit failed: ${res.status} - ${err}`);
  }

  return await res.json();

}
