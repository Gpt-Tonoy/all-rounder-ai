// worker/tools/github.js

const GITHUB_API = "https://api.github.com";
const OWNER = "Gpt-Tonoy";
const REPO = "all-rounder-ai";
const BRANCH = "main";

export async function githubCommit({ path, content, message, token }) {
  // FIX: projects/session_... বাদ দিয়ে সরাসরি frontend/ এ পাঠাবে
  // যদি path এ "projects/" থাকে তাহলে ওটা কেটে দিবে
  let finalPath = path;
  if (path.startsWith("projects/")) {
    const parts = path.split("/");
    finalPath = `frontend/${parts[parts.length - 2] || "app"}/${parts[parts.length - 1]}`;
  }

  const url = `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${finalPath}`;
  
  // Check if file exists to get SHA for update
  let sha = null;
  try {
    const getRes = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/vnd.github.v3+json" }
    });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch(e) {}

  const body = {
    message: message || `Coding Agent: update ${finalPath}`,
    content: btoa(unescape(encodeURIComponent(content))), // base64 encode
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API Error: ${res.status} - ${err}`);
  }

  return await res.json();
}
