import express, {Request, Response} from 'express';
import { getAllBiddings, acceptBid } from '../controller/pickUpUserController';
import {login, registerRider, updateRiderProfile, VerifyUser, ResendOTP, RiderDashboardCompletedOrders, RiderDashboardPendingOrders} from "../controller/riderController"
import { authRider } from '../middleware/authorization'
import { upload } from '../utils/multer'

const router = express.Router();



router.post('/login', login)
router.post('/riders-signup', upload.array('image',3), registerRider) 
router.patch('/update-rider/:signature', authRider, updateRiderProfile)
router.post('/verify/:signature', VerifyUser)
router.get('/resend-otp/:signature', ResendOTP)

router.get('/rider-dashboard-completed-orders', authRider, RiderDashboardCompletedOrders)
router.get('/rider-dashboard-pending-orders', authRider,RiderDashboardPendingOrders )


router.patch("/accept-bid", authRider, acceptBid);
export default router;