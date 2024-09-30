import { Model } from './Model'

export class Review extends Model {
    id?: number
    userId: number
    submissionId: number
    reviewSections: ReviewSection[]
    static tableName = 'reviews'

    constructor(userId: number, submissionId: number, reviewSections: ReviewSection[], id?: number) {
        super()
        this.userId = userId
        this.submissionId = submissionId
        this.reviewSections = reviewSections
        if (id) {
            this.id = id
        }
    }
    static fromData(data: any): Review {
        return new Review(data.userId, data.submissionId, data.content, data.id)
    }
}

export class ReviewSection extends Model {
    id?: number
    reviewId: number
    quote: string
    content: string
    static tableName = 'reviewSections'

    constructor(reviewId: number, quote: string, content: string, id?: number) {
        super()
        this.reviewId = reviewId
        this.quote = quote
        this.content = content
    }
}
