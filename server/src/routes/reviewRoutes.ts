import { Router } from 'express'
import {
    createReviewController,
    getReviewByIdController,
    getReviewsBySubmissionIdController,
} from '../controllers/reviewController'

const router = Router()

router.post('/review', createReviewController)
router.get('/reviews/:id', getReviewByIdController)
router.get('/submission/:id/reviews', getReviewsBySubmissionIdController)

export default router
