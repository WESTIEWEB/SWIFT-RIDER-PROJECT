// import {Pool} from 'pg'
// const port = process.env.DB_PORT as unknown as string
// const pwd = process.env.DB_PASSWORD as string
// const pool = new Pool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: pwd,
//     port: parseInt(port)
// });
// const connectDB = async() => {
//     try{
//         await pool.connect()
//     }catch(error){
//         console.log(error)
//     }
// };
// connectDB();
// export default pool