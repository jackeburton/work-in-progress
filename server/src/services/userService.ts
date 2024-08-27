import client from '../db'
import { User } from '../models/userModel'

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
