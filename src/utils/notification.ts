import { GMAIL_PASS, GMAIL_USER, FromAdminMail, userSubject} from '../config'
import nodemailer from 'nodemailer'
import { string } from 'joi'
import { response } from 'express'

// export const  GenerateOTP = ()=>{
//     const otp = Math.floor(1000 + Math.random() * 9000)
//     //duration of OTP 

//     const expiry = new Date()

//     expiry.setTime(new Date().getTime() + (30 *60 * 1000))

//     return{otp, expiry}
// }

const transport = nodemailer.createTransport({
    service: "gmail", //service and host are the same thing ---refer to documentation
    auth:{
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
    tls:{
        rejectUnauthorized:false
    }


})


export const mailSent2 = async (
    from: string,
    to: string,
    subject: string,
    html: string,
  )=>{
    try {
     const response = await transport.sendMail(
        { from: FromAdminMail,
            subject:
            userSubject,
            to,
            html})
            return response
        
    } catch (error) {
        console.log(error)
    }
}


export const emailHtml2 = (link:string):string=>{
    let response =  `
    <div style="max-width:700px;
    margin:auto;
    border:10px solid #ddd;
    padding:50px 20px;
    font-size: 110%;
    font-style: italics
    "> 

    <h2 style="text-align:center;
    text-transform:uppercase;
    color:teal;
    ">
    Swift Riders
    </h2>

    <p>Hi there, below is your password reset link and it expires in 10 mins</p>
     ${link}
     <h3>DO NOT DISCLOSE TO ANYONE<h3>
     </div>
    `
    return response
}