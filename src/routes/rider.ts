import express, {Request, Response} from 'express';
import {login, registerRider, updateRiderProfile} from "../controller/riderController"
import { authRider } from '../middleware/authorization'
// import { upload } from '../utils/multer'

const router = express.Router();



import multer from 'multer';
const upload = multer({dest: 'uploads/'})

// const router = express.Router();

router.post('/login', login)
router.post('/signup', upload.single('image'), registerRider) 
router.patch('/update-rider/:signature', authRider, updateRiderProfile)
  

export default router;