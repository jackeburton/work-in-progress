import { Router } from 'express'
import { createSubmissionController, getSubmissionByIdController } from '../controllers/submissionController'

const router = Router()

router.post('/submissions', createSubmissionController)
router.post('/submissions/:id', getSubmissionByIdController)

export default router
