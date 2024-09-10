import client from '../db'
import { Review } from '../models/reviewModel'
import { getMultiplyById, getSingleById } from '../utils'

export async function createReview(review: Review): Promise<Review> {
    const queryString =
        'INSERT INTO reviews (userId, submissionId, content) VALUES (' +
        review.userId +
        ', ' +
        review.submissionId +
        ", '" +
        review.content +
        "') RETURNING *"

    try {
        const result = await client.query(queryString)
        const createReview = result.rows[0]
        return new Review(createReview.user_id, createReview.submission_id, createReview.content, createReview.id)
    } catch (error) {
        console.log(queryString)
        console.error('Issue inserting into db', error)
        throw new Error('Database operation failed')
    }
}

export async function getReviewById(id: number): Promise<Review | null> {
    return getSingleById(id, Review)
}

export async function getReviewsBySubmissionId(id: number): Promise<Review[] | null> {
    return getMultiplyById(id, 'submissionId', Review)
}
