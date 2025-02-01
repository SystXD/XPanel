import { loginUser, registerUser } from '#/controllers/auth/user-auth.controllers'
import { Router } from 'express'

const router = Router()


router
.route('/login')
.post(loginUser)

router
.route('/register')
.post(registerUser)

export default router