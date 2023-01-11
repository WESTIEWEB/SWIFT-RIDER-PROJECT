import express, {Request, Response} from 'express';
import {login, registerRider, updateRiderProfile, VerifyUser, ResendOTP, getAllBiddings, RiderAcceptBid, getUserOrderById} from "../controller/riderController"
import { authRider } from '../middleware/authorization'
import { upload } from '../utils/multer'

const router = express.Router();



router.post('/login', login)
router.post('/riders-signup', upload.array('image',3), registerRider) 
router.patch('/update-rider/:signature', authRider, updateRiderProfile)
router.post('/verify/:signature', VerifyUser)
router.get('/resend-otp/:signature', ResendOTP)
  
router.get("/all-biddings", getAllBiddings);
router.patch("/rider-accept-bid/:id", authRider, RiderAcceptBid)
router.get('/get-order-byId/:orderId', authRider, getUserOrderById)

export default router;