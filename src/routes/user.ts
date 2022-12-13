import express, {Request, Response} from 'express';
import { forgotPassword, resetPasswordGet, resetPasswordPost, Signup } from '../controller/userController';

const router = express.Router();

//router.post("/signup", Signup)

//routes for reset user password 
router.post('/forgot-password', forgotPassword)
router.get("/resetpassword/:id/:token", resetPasswordGet)
router.post("/resetpassword/:id/:token",resetPasswordPost)

export default router;