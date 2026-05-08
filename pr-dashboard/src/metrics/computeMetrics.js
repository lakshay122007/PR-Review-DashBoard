export function computeCycleTime(pr) {
    if (!pr.merged_at) return null
    const start = new Date(pr.created_at)
    const end = new Date(pr.merged_at)
    const hours = (end - start) / (1000 * 60 * 60)
    return Math.round(hours * 10) / 10
    }

    export function computeReviewLag(pr, reviews) {
    if (!reviews || reviews.length === 0) return null
    const prOpened = new Date(pr.created_at)
    const firstReview = new Date(reviews[0].submitted_at)
    const hours = (firstReview - prOpened) / (1000 * 60 * 60)
    return Math.round(hours * 10) / 10
    }

    export function flagStale(pr, thresholdDays = 5) {
    if (pr.state !== 'open') return false
    const lastUpdate = new Date(pr.updated_at)
    const now = new Date()
    const days = (now - lastUpdate) / (1000 * 60 * 60 * 24)
    return days > thresholdDays
    }

    export function computeReviewerLoad(prs, reviews) {
    const load = {}
    reviews.forEach(reviewList => {
        reviewList.forEach(review => {
        const login = review.user?.login
        if (!login) return
        load[login] = (load[login] || 0) + 1
        })
    })
    return Object.entries(load)
        .map(([login, count]) => ({ login, count }))
        .sort((a, b) => b.count - a.count)
}