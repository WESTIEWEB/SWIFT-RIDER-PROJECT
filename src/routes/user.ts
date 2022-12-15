import express, {Request, Response} from 'express';
import { Signup } from '../controller/userController';
import { UpdateUserProfile, Login, VerifyUser, ResendOTP , forgotPassword, resetPasswordGet, resetPasswordPost} from "../controller/userController";
import { auth } from '../middleware/authorization';


const router = express.Router();

router.post('/signup', Signup)
router.patch("/updateUserProfile/:id", auth, UpdateUserProfile);
router.post('/login', Login)
router.post('/verify/:signature', VerifyUser)
router.get('/resend-otp/:signature', ResendOTP)

//routes for reset user password 
router.post('/forgot-password', forgotPassword)
router.get("/resetpassword/:id/:token", resetPasswordGet)
router.post("/resetpassword/:id/:token", resetPasswordPost)


export default router;