import { SubmissionWithReviews } from './submissionModel'

export class User {
    id?: number
    email: string
    username: string

    constructor(email: string, username: string, id?: number) {
        this.email = email
        this.username = username
        if (id) {
            this.id = id
        }
    }
}

export type UserInfo = {
    user: User
    submissionsWithReviews: SubmissionWithReviews[] | null
}
