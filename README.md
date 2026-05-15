# PR Dashboard

A GitHub-connected dashboard that surfaces the metrics engineering teams actually need — cycle time, review lag, reviewer load, and stale PRs.

**Live at:** https://pr-dashboard-puce.vercel.app

---

## The problem

GitHub shows you what your PRs are. It doesn't show you where your code is getting stuck. Most teams have no idea how long PRs sit before someone reviews them, who's doing most of the reviewing, or which PRs have gone cold. This dashboard answers those questions.

---

## What you get

**Repo Health Score** — a single 0–100 number calculated from cycle time, review lag, stale PRs, and reviewer distribution.

**Cycle Time** — average time from first commit to merge, with a trend chart so you can see if things are improving.

**Review Lag** — how long PRs sit before someone looks at them.

**Reviewer Load** — who is doing all the reviews. Bottlenecks become immediately obvious.

**PR Size Distribution** — small, medium, and large PRs at a glance. Oversized PRs are one of the biggest causes of slow reviews.

**Stale PRs** — open PRs that haven't been touched in 5+ days.

**Activity Heatmap** — which day of the week your team merges the most.

**PR Timeline** — Gantt-style view of recent merged PRs, color coded by how long they took.

**Any public repo** — not just yours. Type any owner and repo name to analyze any public GitHub project.

---

## How to use it

Go to https://pr-dashboard-puce.vercel.app, sign in with GitHub, and select a repo from the sidebar. That's it.

The app only reads your repo and PR data. It never writes anything to GitHub.

---

## Tech

React, Tailwind CSS, Recharts, Zustand, GitHub OAuth 2.0, Vercel.
