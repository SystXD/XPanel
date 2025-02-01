import { Router } from 'express'
import authRouter from './auth/auth.routes'
const router = Router();

router.use('/api/v1/user', authRouter)

export default router;