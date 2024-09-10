import passport from 'passport'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel'
import { authenticateJWT } from '../utils'

const router = Router()

const generateToken = (user: User) => {
    const payload = {
        userId: user.id,
        email: user.email,
        name: user.username,
    }
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' })
}

router.get(
    '/google',
    (req, res, next) => {
        console.log('Initiating Google OAuth flow...')
        next()
    },
    passport.authenticate('google', {
        scope: ['email', 'profile'],
        session: false,
    })
)
router.get(
    '/oauth2/redirect/google',
    passport.authenticate('google', { failureRedirect: 'test', session: false }),
    (req, res) => {
        if (req.user === undefined) {
            res.redirect('http://localhost:5173/error')
        } else {
            const token = generateToken(req.user as User)
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Set to true in production
                sameSite: 'strict',
            })
            res.redirect('http://localhost:5173/') // Redirect to frontend after successful login
        }
    }
)

router.get('/me', authenticateJWT, (req, res) => {
    console.log('getting /me')
    if (req.user) {
        res.json(req.user)
    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }
})
export default router
