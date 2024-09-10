import express, { Request, Response } from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes'
import submissionRoutes from './routes/submissionRoutes'
import reviewRoutes from './routes/reviewRoutes'
import listEndpoints from 'express-list-endpoints'
import passportGoogle from 'passport-google-oauth2'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { authenticateJWT } from './utils'
import loginRoutes from './routes/loginRoutes'
import { createUser, getUserByEmail } from './services/userService'

const GoogleStrategy = passportGoogle.Strategy

const generateToken = (user: any) => {
    return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '1h' })
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: 'http://localhost:3000/api/oauth2/redirect/google',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Retrieve or create the user in the database
                let user = await getUserByEmail(profile.emails[0].value)

                if (!user) {
                    user = await createUser({
                        email: profile.emails[0].value,
                        username: profile.displayName,
                    })
                }

                done(null, user) // Pass the user to the next middleware
            } catch (error) {
                done(error, null)
            }
        }
    )
)

const app = express()
app.use(cookieParser())
app.use(
    cors({
        origin: 'http://localhost:5173', // Your frontend URL
        credentials: true, // Allow cookies and authorization headers
    })
)
app.use(express.json())

const PORT = process.env.SERVER_PORT || '3000'
const api_prefix = '/api'

app.use(api_prefix, loginRoutes)

app.use(api_prefix, authenticateJWT, userRoutes)
app.use(api_prefix, authenticateJWT, submissionRoutes)
app.use(api_prefix, authenticateJWT, reviewRoutes)

const endpoints = listEndpoints(app)
console.log(endpoints)

app.listen(PORT, () => {
    console.log('Server Listening on PORT:', PORT)
})
