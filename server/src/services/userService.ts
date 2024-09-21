import client from '../db'
import { SubmissionWithReviews } from '../models/submissionModel'
import { User, UserInfo } from '../models/userModel'

export async function createUser(user: User): Promise<User> {
    const queryString = 'INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *'

    try {
        const result = await client.query(queryString, [user.email, user.username])
        const createUser = result.rows[0]
        return new User(createUser.email, createUser.name, createUser.id)
    } catch (error) {
        console.error('Issue inserting into db', error)
        throw new Error('Database operation failed')
    }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const queryString = 'SELECT * FROM users WHERE email = $1'
    try {
        const result = await client.query(queryString, [email])
        if (result.rows.length === 0) {
            return null
        } else {
            const user = result.rows[0]
            return new User(user.email, user.username, user.id)
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}

export async function getUserById(id: number): Promise<User | null> {
    const queryString = 'SELECT * FROM users WHERE id = $1'
    try {
        const result = await client.query(queryString, [id])
        if (result.rows.length === 0) {
            return null
        } else {
            const user = result.rows[0]
            return new User(user.email, user.username, user.id)
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}

export async function loadUserInfoById(id: number): Promise<UserInfo | null> {
    const userQueryString = 'SELECT * FROM users WHERE id = $1'
    const submissionQueryString = 'SELECT * FROM submissions WHERE userId = $1'

    try {
        const userResult = await client.query(userQueryString, [id])

        if (userResult.rows.length === 0) {
            return null
        }
        const submissionResult = await client.query(submissionQueryString, [id])
        const submissionsWithReviews: SubmissionWithReviews[] = []
        if (submissionResult.rows.length !== 0) {
            for (const submission of submissionResult.rows) {
                const reviewQueryString = 'SELECT * FROM reviews WHERE submissionId = $1'
                const reviewResult = await client.query(reviewQueryString, [submission.id])
                submissionsWithReviews.push({ submission, reviews: reviewResult.rows })
            }
        }

        const userInfo: UserInfo = {
            user: userResult.rows[0],
            submissionsWithReviews: submissionsWithReviews,
        }
        return userInfo
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}

export async function getSubmissionsWithReviewsByUserId(id: number): Promise<SubmissionWithReviews[] | null> {
    const submissionQueryString = 'SELECT * FROM submissions WHERE userId = $1'

    try {
        const submissionResult = await client.query(submissionQueryString, [id])
        const submissionsWithReviews: SubmissionWithReviews[] = []
        if (submissionResult.rows.length !== 0) {
            for (const submission of submissionResult.rows) {
                const reviewQueryString = 'SELECT * FROM reviews WHERE submissionId = $1'
                const reviewResult = await client.query(reviewQueryString, [submission.id])
                submissionsWithReviews.push({ submission, reviews: reviewResult.rows })
            }
        }

        return submissionsWithReviews
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}
