export type User = {
    id: number
    username: string
    email: string
}

export type Submission = {
    id: number
    userId: number
    content: string
    createdAt: Date
}

export type Review = {
    id: number
    userId: number
    submissionId: number
    content: string
}

export type SubmissionWithReviews = {
    submission: Submission
    reviews: Review[]
}

export type UserInfo = {
    User: User
    SubmissionsWithReviews: SubmissionsWithReviews[] | null
}
