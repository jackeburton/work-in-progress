import { Router } from 'express'
import {
    createSubmissionController,
    getNewSubmissionsController,
    getSubmissionByIdController,
    getSubmissionsByUserIdController,
} from '../controllers/submissionController'

const router = Router()

router.post('/submissions', createSubmissionController)
router.get('/submissions/:id', getSubmissionByIdController)
router.get('user/:id/submissions', getSubmissionsByUserIdController)
router.get('/submissions', getNewSubmissionsController)

export default router
