import { Router } from 'express'
import {
    createUserController,
    getUserByEmailController,
    loadUserInfoByIdController,
} from '../controllers/userController'

const router = Router()

router.post('/users', createUserController)
router.get('/users', getUserByEmailController)
router.get('/user/:id', loadUserInfoByIdController)

export default router
