import { Router } from 'express'
import { createReviewController, getReviewByIdController } from '../controllers/reviewController'

const router = Router()

router.post('/reviews', createReviewController)
router.get('/reviews/:id', getReviewByIdController)

export default router
