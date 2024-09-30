import client from '../db'
import { Review, ReviewSection } from '../models/reviewModel'
import { getMultiplyById, getSingleById } from '../utils'

export async function createReview(review: Review): Promise<Review> {
    const reviewSectionQueryString =
        'INSERT INTO reviewSections (reviewId, quote, content) VALUES ($1, $2, $3) RETURNING *'
    const reviewQueryString = 'INSERT INTO reviews (userId, submissionId) VALUES ($1, $2) RETURNING *'

    try {
        const result = await client.query(reviewQueryString, [review.userId, review.submissionId])
        const dbReview = result.rows[0]
        const objReviewSections: ReviewSection[] = []
        for (const reviewSection of review.reviewSections) {
            const result = await client.query(reviewSectionQueryString, [
                dbReview.id,
                reviewSection.quote,
                reviewSection.id,
            ])
            const dbReviewSection = result.rows[0]
            objReviewSections.push(new ReviewSection(dbReview.id, dbReviewSection.quote, dbReviewSection.content))
        }
        return new Review(dbReview.userId, dbReview.submissionId, objReviewSections)
    } catch (error) {
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
