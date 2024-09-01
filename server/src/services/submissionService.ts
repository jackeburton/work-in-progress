import client from '../db'
import { Submission } from '../models/submissionModel'

export async function createSubmission(submission: Submission): Promise<Submission> {
    const queryString =
        'INSERT INTO submissions (user_id, content) VALUES (' +
        submission.userId +
        ", '" +
        submission.content +
        "') RETURNING *"

    try {
        const result = await client.query(queryString)
        const createSubmission = result.rows[0]
        return new Submission(createSubmission.user_id, createSubmission.content, createSubmission.id)
    } catch (error) {
        console.error('Issue inserting into db', error)
        throw new Error('Database operation failed')
    }
}

export async function getSubmissionById(id: number): Promise<Submission | null> {
    const queryString = 'SELECT * FROM submissions WHERE id = ' + id
    try {
        const result = await client.query(queryString)
        if (result.rows.length === 0) {
            return null
        } else {
            const submission = result.rows[0]
            return new Submission(submission.user_id, submission.content, submission.created_at, submission.id)
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}

export async function getSubmissionsByUserId(id: number): Promise<Submission[] | null> {
    const queryString = 'SELECT * FROM submissions WHERE user_id = ' + id
    try {
        const result = await client.query(queryString)
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

export async function getNewSubmissions(dateTime: Date): Promise<Submission[] | null> {
    const queryString = 'SELECT * FROM submissions WHERE created_at > ' + dateTime
    try {
        const result = await client.query(queryString)
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
