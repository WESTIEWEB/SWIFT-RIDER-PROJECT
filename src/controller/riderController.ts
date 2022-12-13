import { Request, Response, NextFunction } from "express";
import { RiderInstance, RiderAttributes } from "../models/riderModel";
import { loginSchema, option } from "../utils/validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      { id: rider.id, role: rider.role },
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
      route: "/users/login",
    });
  }
};
