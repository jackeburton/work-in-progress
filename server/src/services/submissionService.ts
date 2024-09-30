import client from '../db'
import { Submission } from '../models/submissionModel'
import { getMultiplyById, getSingleById } from '../utils'

export async function createSubmission(submission: Submission): Promise<Submission> {
    const queryString = 'INSERT INTO submissions (userId, content) VALUES ($1, $2) RETURNING *'
    try {
        const result = await client.query(queryString, [submission.userId, submission.content])
        const createSubmission = result.rows[0]
        return new Submission(createSubmission.user_id, createSubmission.content, createSubmission.id)
    } catch (error) {
        console.error('Issue inserting into db', error)
        throw new Error('Database operation failed')
    }
}

export async function getSubmissionById(id: number): Promise<Submission | null> {
    return getSingleById(id, Submission)
}

export async function getSubmissionsByUserId(id: number): Promise<Submission[] | null> {
    return getMultiplyById(id, 'userId', Submission)
}

export async function getNewSubmissions(dateTime: Date): Promise<Submission[] | null> {
    const queryString = 'SELECT * FROM submissions WHERE created_at > $1'
    try {
        const result = await client.query(queryString, [dateTime])
        if (result.rows.length === 0) {
            return null
        } else {
            const submissions = result.rows
            return submissions.map(
                (submission) =>
                    new Submission(submission.user_id, submission.content, submission.created_at, submission.id)
            )
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}

export async function getSubmissionsNotByUserId(id: number): Promise<Submission[] | null> {
    const submissionQueryString = 'SELECT * FROM submissions WHERE userId != $1'
    try {
        const result = await client.query(submissionQueryString, [id])
        if (result.rows.length === 0) {
            return null
        } else {
            const submissionsWithReviewCount = await Promise.all(
                result.rows.map(async (submission) => {
                    const reviewQueryString = 'SELECT COUNT(*) AS reviewcount FROM reviews WHERE submissionId = $1'

                    const result = await client.query(reviewQueryString, [submission.id])

                    return { ...submission, reviewCount: Number(result.rows[0].reviewcount) }
                })
            )
            return submissionsWithReviewCount
                .filter((submission) => submission.reviewCount < 3)
                .sort((a, b) => b.reviewCount - a.reviewCount)
                .slice(0, 3)
                .map((submission) => {
                    return new Submission(submission.user_id, submission.content, submission.created_at, submission.id)
                })
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}
