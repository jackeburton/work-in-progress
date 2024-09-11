import { Request, Response } from 'express'
import { getLoginPayload } from '../services/loginService'
import { User } from '../models/userModel'
export async function getLoginPayloadController(req: Request, res: Response) {
    console.log('getting /newme')
    if (req.user) {
        // this sends the user back to the front end but we can also send the state needed which will be
        //loadUserInfoById -> const userInfo: UserInfo = {
        //    User,
        //    SubmissionsWithReviews
        //}
        // and getSubmissionsNotByUserId -> Submission[]
        try {
            const loginPayload = await getLoginPayload(req.user as User)
            res.json(loginPayload)
        } catch (error) {
            console.error('Error getting login payload', error)
            res.status(500).json({ message: 'internal server error' })
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }
}
