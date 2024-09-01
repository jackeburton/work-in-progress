import client from '../db'
import { Review } from '../models/reviewModel'

export async function createReview(review: Review): Promise<Review> {
    const queryString =
        'INSERT INTO reviews (user_id, submission_id, content) VALUES (' +
        review.userId +
        ', ' +
        review.submissionId +
        ', ' +
        review.content +
        "') RETURNING *"

    try {
        const result = await client.query(queryString)
        const createReview = result.rows[0]
        return new Review(createReview.user_id, createReview.submission_id, createReview.content, createReview.id)
    } catch (error) {
        console.error('Issue inserting into db', error)
        throw new Error('Database operation failed')
    }
}

export async function getReviewById(id: number): Promise<Review | null> {
    const queryString = 'SELECT * FROM reviews WHERE id = ' + id
    try {
        const result = await client.query(queryString)
        if (result.rows.length === 0) {
            return null
        } else {
            const review = result.rows[0]
            return new Review(review.user_id, review.submission_id, review.content, review.id)
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}

export async function getReviewsBySubmissionId(id: number): Promise<Review[] | null> {
    const queryString = 'SELECT * FROM reviews WHERE submission_id = ' + id
    try {
        const result = await client.query(queryString)
        if (result.rows.length === 0) {
            return null
        } else {
            const reviews = result.rows
            return reviews.map((review) => new Review(review.user_id, review.submission_id, review.content, review.id))
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}
