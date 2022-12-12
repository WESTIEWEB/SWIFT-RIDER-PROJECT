import express, {Request, Response} from 'express';
import {login, updateRiderProfile} from "../controller/riderController"

const router = express.Router();

router.post('/login', login)
router.patch('/update-profile', updateRiderProfile)

export default router;