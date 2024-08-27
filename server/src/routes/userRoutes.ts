import { Router } from 'express'
import { createUserController, getUserByEmailController } from '../controllers/userController'

const router = Router()

router.post('/users', createUserController)
router.get('/users', getUserByEmailController)

export default router
