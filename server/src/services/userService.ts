import client from '../db'
import { SubmissionWithReviews } from '../models/submissionModel'
import { User, UserInfo } from '../models/userModel'

// take the User and insert into db
export async function createUser(user: User): Promise<User> {
    const queryString =
        "INSERT INTO users (email, username) VALUES ('" + user.email + "', '" + user.username + "') RETURNING *"

    try {
        const result = await client.query(queryString)
        const createUser = result.rows[0]
        return new User(createUser.email, createUser.name, createUser.id)
    } catch (error) {
        console.error('Issue inserting into db', error)
        throw new Error('Database operation failed') // TODO add error classes
    }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const queryString = "SELECT * FROM users WHERE email = '" + email + "'"
    try {
        const result = await client.query(queryString)
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
    const queryString = 'SELECT * FROM users WHERE id = ' + id
    try {
        const result = await client.query(queryString)
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
    const userQueryString = "SELECT * FROM users WHERE id = '" + id + "'"
    const submissionQueryString = "SELECT * FROM submissions WHERE userId = '" + id + "'"

    try {
        const userResult = await client.query(userQueryString)

        if (userResult.rows.length === 0) {
            return null
        }
        const submissionResult = await client.query(submissionQueryString)
        const submissionsWithReviews: SubmissionWithReviews[] = []
        if (submissionResult.rows.length !== 0) {
            for (const submission of submissionResult.rows) {
                const reviewQueryString = "SELECT * FROM reviews WHERE submissionId = '" + submission.id + "'"
                const reviewResult = await client.query(reviewQueryString)
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
    const submissionQueryString = "SELECT * FROM submissions WHERE userId = '" + id + "'"

    try {
        const submissionResult = await client.query(submissionQueryString)
        const submissionsWithReviews: SubmissionWithReviews[] = []
        if (submissionResult.rows.length !== 0) {
            for (const submission of submissionResult.rows) {
                const reviewQueryString = "SELECT * FROM reviews WHERE submissionId = '" + submission.id + "'"
                const reviewResult = await client.query(reviewQueryString)
                submissionsWithReviews.push({ submission, reviews: reviewResult.rows })
            }
        }

        return submissionsWithReviews
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}
