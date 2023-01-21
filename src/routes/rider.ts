import express from 'express';
import { registerRider, updateRiderProfile, VerifyUser, ResendOTP, getAllBiddings, acceptBid, RiderHistory, getRiderProfile, getUserOrderById, getOrderOwnerNameById, DeliveryOtp, DeliveryResendOTP} from "../controller/riderController"
import { authRider } from '../middleware/authorization'
import { upload } from '../utils/multer'

const router = express.Router();



// router.post('/login', login)
router.post('/riders-signup', upload.array('image',3), registerRider) 
router.patch('/update-rider/:signature', authRider, updateRiderProfile)
router.post('/verify/:signature', VerifyUser)
router.get('/resend-otp/:signature', ResendOTP)

router.post('/delivery-verify/:signature', DeliveryOtp)
router.get('/delivery-resend-otp/:signature', DeliveryResendOTP)

router.get('/rider-order-profile/:riderId', getRiderProfile)
router.get("/all-biddings", getAllBiddings);
router.get("/rider-history",authRider, RiderHistory);

router.get('/get-order-byId/:orderId', authRider, getUserOrderById)
router.patch("/accept-bid/:orderId", authRider, acceptBid);
router.get('/get-order-owner-name-byId/:orderOwnerId', getOrderOwnerNameById)
export default router;
