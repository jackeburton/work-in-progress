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

export type SubmittingReview = {
    userId: number
    submissionId: number
    reviewSections: ReviewSection[]
}

export type ReviewSection = {
    quote: string
    content: string
}

export type SubmittingSubmission = {
    userId: number
    content: string
}

export type SubmissionWithReviews = {
    submission: Submission
    reviews: Review[]
}

export type UserInfo = {
    User: User
    SubmissionsWithReviews: SubmissionWithReviews[] | null
}

export type LoginPayload = {
    user: User
    submissionsWithReviews: SubmissionWithReviews[] | null
    submissionsToReview: Submission[] | null
}

export type ReviewCard = Submission & {
    reviewContent: string
    reviewSent: boolean
    selected: boolean
}
