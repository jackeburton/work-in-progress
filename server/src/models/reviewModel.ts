import { Model } from './Model'

export class Review extends Model {
    id?: number
    userId: number
    submissionId: number
    content: string
    static tableName = 'reviews'

    constructor(userId: number, submissionId: number, content: string, id?: number) {
        super()
        this.userId = userId
        this.submissionId = submissionId
        this.content = content
        if (id) {
            this.id = id
        }
    }
    static fromData(data: any): Review {
        return new Review(data.userId, data.submissionId, data.content, data.id)
    }
}
