import { Submission, SubmissionWithReviews } from './submissionModel'
import { User } from './userModel'

export type Payload = {
    user: User
    submissionsToReview: Submission[]
    submissionsWithReviews: SubmissionWithReviews[]
}
