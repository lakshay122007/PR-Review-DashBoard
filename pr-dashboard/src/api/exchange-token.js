export default async function handler(req, res) {
    const { code } = req.body

    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        })
    })

    const data = await response.json()

    if(data.access_token) {
        res.status(200).json({token: data.access_token})
    } 
    else {
        res.status(400).json({error: 'Token exchange failed'})
    }
}