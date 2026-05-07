# PR Dashboard

A GitHub-connected dashboard that surfaces the metrics your team actually needs — cycle time, review lag, reviewer load, and stale PRs. Built because GitHub's native interface tells you what your PRs are, not how healthy your PR process is.

## What it does

- Shows average cycle time (first commit to merge) across your repos
- Tracks review lag — how long PRs sit before someone looks at them
- Visualizes reviewer load so bottlenecks are obvious
- Flags stale PRs that have gone quiet
- Trends cycle time week over week so you can see if things are improving

## Tech stack

- React + Vite
- Tailwind CSS
- Recharts
- Zustand
- GitHub OAuth + REST API
- Deployed on Vercel

## Running locally

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/pr-dashboard.git
cd pr-dashboard
npm install
```

Create a `.env` file in the root:

```
VITE_GITHUB_CLIENT_ID=your_client_id
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/callback
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173`.

## GitHub OAuth setup

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create a new OAuth App
3. Set the homepage URL to `http://localhost:5173`
4. Set the callback URL to `http://localhost:5173/callback`
5. Copy the client ID into your `.env` file

## Project structure

```
src/
  api/          GitHub API calls
  components/   Reusable UI components
  hooks/        Custom React hooks
  pages/        LoginPage, DashboardPage
  store/        Zustand auth store
```

## Why I built this

Most CI/CD and project management tools show you task status. None of them clearly show you where time is being lost in the review process. This dashboard tries to answer one question: where is your team's code getting stuck before it ships?
