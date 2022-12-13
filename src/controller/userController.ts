import { Request, Response } from "express";
import { editProfileSchema, option } from "../utils/validation";
import { UserInstance } from "../models/userModel";
import { JwtPayload } from "jsonwebtoken";

export const UpdateUserProfile = async (req: JwtPayload, res: Response) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const id = req.body;
    const validateResult = editProfileSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    const User = await UserInstance.findOne({
      where: { id: id },
    });
    if (User) {
      const newUser = await User.update({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
      });
      return res.status(201).json({
        message: "Profile updated successfully",
      });
    }
    return res.status(400).json({
      message: "User does not exist",
    });
  } catch (err) {
    console.log(err);
  }
};
