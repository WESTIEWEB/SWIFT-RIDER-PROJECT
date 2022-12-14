import { Request, Response, NextFunction } from "express";
import { RiderInstance, RiderAttributes } from "../models/riderModel";
import { GeneratePassword, GenerateSalt, GenerateSignature, loginSchema, option, registerSchema } from "../utils/validation";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import {v4 as uuidv4 } from 'uuid';
import { emailHtml, GenerateOTP, mailSent, onRequestOTP } from "../utils/notification";
import { UserInstance } from "twilio/lib/rest/conversations/v1/user";
import { FromAdminMail, userSubject } from "../config";



//@desc Register rider
//@route Post /rider/signup
//@access Public
export const registerRider = async (req: JwtPayload, res: Response, next:NextFunction) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone, address, image, plateNumber } = req.body;
    if(password !== confirmPassword){
        return res.status(400).json({Error:'Password does not match'})
    }
    if(!firstName || !lastName || !email || !password || !confirmPassword || !phone || !address || !image || !plateNumber){
        return res.status(400).json({Error:'All fields are required'})
    }

    const uuidrider = uuidv4();

    const validateResult = registerSchema.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    //generate salt
    const salt = await GenerateSalt();

    //generate password
    const userPassword = await GeneratePassword(password, salt);

    //Generate OTP
    const { otp, expiry } = GenerateOTP();

    //check if user exist
    const Rider = (await RiderInstance.findOne({
      where: { email: email },
    })) as unknown as RiderAttributes;

    //create user
    if (!Rider) {
      let rider = await RiderInstance.create({
        id: uuidrider,
        firstName,
        lastName,
        email,
        password: userPassword,
        salt,
        phone,
        address,
        image: req.file,
        plateNumber,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: false,
        role: 'rider',
      })
      //send OTP
      //await onRequestOTP(otp, phone);

      //send email
      const html = emailHtml(otp);
      await mailSent(FromAdminMail, email, userSubject, html);

      //check if user exist and is fully registered inordr to be issued an identity
      const Rider = (await RiderInstance.findOne({
        where: { email: email },
      })) as unknown as RiderAttributes;

      //Generate a signature
      //This signature hide the user created details or showing them error message.
      //The below details are what would be generated with the message as response.
      let signature = await GenerateSignature({
        id: Rider.id,
        email: Rider.email,
        verified: Rider.verified,
      });
      //We return signature to the user to be used for authentication.
      return res.status(201).json({
        message: "Rider created successfully",
        signature,
        verified: Rider.verified,
      });
    }
    return res.status(400).json({ message: "Rider already exist" });

    console.log(userPassword);
  } catch (err: any) {
    res.status(500).json({
      Error: "E NO DEY WORK",
      message: err.stack,
      route: "/riders/signup",
    });
  }
};




//@desc Login rider
//@route Post /auth/login
//@access Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { email, password } = req.body;

    //validate email and password
    const validateResult = loginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    const { email, password } = validateResult.value;

    // check if the rider exist
    const rider = (await RiderInstance.findOne({
      where: { email },
    })) as unknown as RiderAttributes;
    if (!rider) {
      return res.status(400).json("Invalid credentials");
    }

    //Check if password matches
    const isPassword = await bcrypt.compare(password, rider.password);

    if (!isPassword) {
      return res.status(400).json("Invalid credentials");
    }

    const token = jwt.sign(
      { _id: rider.email, role: rider.role },
      process.env.App_secret!,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      Error: "Internal server Error",
      route: "/riders/login",
    });
  }
};
