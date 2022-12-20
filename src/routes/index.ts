import express, {Request, Response} from 'express';
import { authRider } from '../middleware/authorization';
import { getAllBiddings } from '../controller/pickUpUserController';

const router = express.Router();

router.get('/', (req:Request, res:Response) => {
 res.status(200).send(`WELCOME TO SWIFT RIDER, CLICK TO VIEW DOCUMENTATION`)
})

router.get("/all-biddings", authRider, getAllBiddings);

export default router;