import express, {Request, Response} from 'express';

// import {login} from "../controller/riderController"

const router = express.Router();


import {login} from "../controller/riderController"
import {registerRider} from "../controller/riderController";
// import { upload } from '../utils/multer'

import multer from 'multer';
const upload = multer({dest: 'uploads/'})

const router = express.Router();

router.post('/login', login)
router.post('/signup', upload.single('image'), registerRider) 
  

export default router;