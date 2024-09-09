import { Router } from 'express'
import {
    createSubmissionController,
    getSubmissionByIdController,
    getSubmissionsByUserIdController,
    getSubmissionsNotByUserIdController,
} from '../controllers/submissionController'

const router = Router()

router.post('/submissions', createSubmissionController)
router.get('/submissions/:id', getSubmissionByIdController)
router.get('user/:id/submissions', getSubmissionsByUserIdController)
router.get('/submissionsToReview/:id', getSubmissionsNotByUserIdController)

export default router
