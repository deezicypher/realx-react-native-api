import express,{ Router, type Router as Routertype} from 'express'
import { googleLogin, googleSignup } from '../controllers/google-auth'

// const router: ReturnType<typeof Router> = Router();

const router:Routertype = Router()

router.post('/login',googleLogin)
router.post('/signup',googleSignup)


export default router