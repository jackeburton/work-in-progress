import { Payload } from '../models/loginModel'
import { User } from '../models/userModel'
import { getSubmissionsNotByUserId } from './submissionService'
import { getSubmissionsWithReviewsByUserId, getUserById, loadUserInfoById } from './userService'

export async function getLoginPayload(user: User) {
    if (user.id) {
        const loadedUser = await getUserById(user.id)
        if (loadedUser == null) {
            console.error('Issue logging in')
            throw new Error('Login failed')
        }
        const submissionsWithReviews = await getSubmissionsWithReviewsByUserId(user.id)
        const submissionsNotByUser = await getSubmissionsNotByUserId(user.id)
        return {
            user: loadedUser,
            submissionsWithReviews: submissionsWithReviews,
            submissionsToReview: submissionsNotByUser,
        } as Payload
    } else {
        console.error('Issue logging in')
        throw new Error('Login failed')
    }
}
