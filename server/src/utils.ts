import client from './db'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from './models/userModel'

export const generateToken = (user: User) => {
    const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
    } as User
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' })
}

export const authenticateJWT = (req: Request, res: Response, next: Function) => {
    const token = req.cookies.jwt

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403)
        console.log(user)
        req.user = user as User
        next()
    })
}

interface getInterface<T> {
    tableName: string
    fromData(data: any): T
}

export async function getSingleById<Type>(id: number, modelClass: getInterface<Type>): Promise<Type | null> {
    const queryString = 'SELECT * FROM ' + modelClass.tableName + ' WHERE id = ' + id
    try {
        const result = await client.query(queryString)
        if (result.rows.length === 0) {
            return null
        } else {
            const item = result.rows[0]
            return modelClass.fromData(item)
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}

export async function getMultiplyById<Type>(
    id: number,
    queryField: string,
    modelClass: getInterface<Type>
): Promise<Type[] | null> {
    const queryString = 'SELECT * FROM ' + modelClass.tableName + ' WHERE ' + queryField + ' = ' + id
    try {
        const result = await client.query(queryString)
        if (result.rows.length === 0) {
            return null
        } else {
            const items = result.rows
            return items.map((item) => modelClass.fromData(item))
        }
    } catch (error) {
        console.error('Issue selecting from db', error)
        throw new Error('Database operation failed')
    }
}
