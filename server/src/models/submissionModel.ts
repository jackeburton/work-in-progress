import { Model } from './Model'
import { Review } from './reviewModel'

export class Submission extends Model {
    id?: number
    userId: number
    content: string
    createdAt?: Date
    static tableName = 'submissions'

    constructor(userId: number, content: string, createdAt?: Date, id?: number) {
        super()
        this.userId = userId
        this.content = content

        if (createdAt) {
            this.createdAt = createdAt
        }
        if (id) {
            this.id = id
        }
    }

    static fromData(data: any): Submission {
        return new Submission(data.userId, data.content, data.createdAt, data.id)
    }
}

export type SubmissionWithReviews = {
    submission: Submission
    reviews: Review[]
}
