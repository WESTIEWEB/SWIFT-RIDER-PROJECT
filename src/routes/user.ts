import express, {Request, Response} from 'express';
import { Signup } from '../controller/userController';

const router = express.Router();

router.post('/signup', Signup)


export default router;