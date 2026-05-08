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