const BASE_URL = 'https://api.github.com'

export async function getUser(token) {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    }
  })
  return res.json()
}

export async function getUserRepos(token) {
  const res = await fetch(`${BASE_URL}/user/repos?sort=updated&per_page=20`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    }
  })
  return res.json()
}

export async function getRepoPRs(token, owner, repo) {
  const res = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/pulls?state=closed&per_page=50&sort=updated`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    }
  )
  return res.json()
}

export async function getPRReviews(token, owner, repo, pullNumber) {
  const res = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    }
  )
  return res.json()
}

export async function getOpenPRs(token, owner, repo) {
    const res = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/pulls?state=open&per_page=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json'
        }
      }
    )
    return res.json()
}