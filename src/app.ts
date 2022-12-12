import express, {Request, Response, NextFunction} from "express";
import logger from "morgan";
import cookieParser from "cookie-parser"
import userRouter from './routes/user';
import riderRouter from './routes/rider';
import indexRouter from './routes/index';
import adminRouter from './routes/admin';
import {db} from './config'
import dotenv from 'dotenv';
dotenv.config();


//Sequelize connection
db.sync().then(() => {
    console.log('DB connected successfully')
}).catch(err => {
 console.log(err)
})
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname')

const app = express();

app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());




//Router middleware
app.use('/users', userRouter)
app.use('/', indexRouter)
app.use('/rider', riderRouter)
app.use('/admin', adminRouter)


// app.get('/about', (req:Request, res:Response)=> {
//  res.status(200).json({
//     message: "Success",
//  })
// })

const port = 6000;
app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})

export default app;