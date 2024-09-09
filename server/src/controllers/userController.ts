import { Request, Response } from 'express'
import { createUser, getUserByEmail, loadUserInfoById } from '../services/userService'
import { UserInfo } from '../models/userModel'

export async function createUserController(req: Request, res: Response) {
    const { email, username } = req.body

    if (email === undefined || username == undefined) {
        res.status(400).json({
            message: 'Request must contain "email" and "username" in body',
        })
    } else {
        try {
            const newUser = await createUser({ email, username })
            res.status(200).json(newUser)
        } catch (error) {
            console.error('Error creating user', error)
            res.status(500).json({ message: 'internal server error' })
        }
    }
}

export async function getUserByEmailController(req: Request, res: Response) {
    console.log('getting user via email')
    const email = req.query.email
    console.log(req.query, email)
    if (email === undefined || typeof email !== 'string') {
        res.status(400).json({
            message: 'Request must contain only one "email" in parameters',
        })
    } else {
        try {
            const user = await getUserByEmail(email)
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: 'user not found' })
            }
        } catch (error) {
            console.error('Error searching for user', error)
            res.status(500).json({ message: 'internal server error' })
        }
    }
}

export async function loadUserInfoByIdController(req: Request, res: Response) {
    console.log('loading user info')
    const userId = parseInt(req.params.id)
    if (isNaN(userId)) {
        res.status(400).json({
            message: 'userId must be an integer',
        })
    } else {
        try {
            const userInfo = await loadUserInfoById(userId)
            if (userInfo) {
                res.status(200).json(userInfo)
            } else {
                res.status(404).json({ message: 'user not found' })
            }
        } catch (error) {
            console.error('Error searching for user', error)
            res.status(500).json({ message: 'internal server error' })
        }
    }
}
