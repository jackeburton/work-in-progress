import { Request, Response } from 'express'
import passport from 'passport'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel'
import { authenticateJWT, generateToken } from '../utils'
import { getLoginPayloadController } from '../controllers/loginController'

const router = Router()

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
            res.redirect('http://localhost:5173/submit') // Redirect to frontend after successful login
        }
    }
)

router.get('/me', authenticateJWT, (req, res) => {
    console.log('getting /me')
    if (req.user) {
        // this sends the user back to the front end but we can also send the state needed which will be
        //loadUserInfoById -> const userInfo: UserInfo = {
        //    User,
        //    SubmissionsWithReviews
        //}
        // and getSubmissionsNotByUserId -> Submission[]
        res.json(req.user)
    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }
})

router.get('/newme', authenticateJWT, getLoginPayloadController)
export default router
