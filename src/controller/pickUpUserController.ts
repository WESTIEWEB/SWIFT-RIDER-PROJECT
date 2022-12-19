import { Response } from "express";
import {
  PickUpUserAttribute,
  PickUpUserInstance,
} from "../models/pickUpUserModel";
import { UserAttribute, UserInstance } from "../models/userModel";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { option, pickUpUserSchema } from "../utils/validation";
import { Op } from "sequelize";
import { count } from "console";

export const orderRide = async (req: JwtPayload, res: Response) => {
  try {
    const { id } = req.user;
    const {
      pickupLocation,
      packageDescription,
      dropOffLocation,
      dropOffPhonenumber,
      offerAmount,
    } = req.body;
    const orderUUID = uuidv4();
    //validate req body
    const validateResult = pickUpUserSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //verify if user exist
    const user = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttribute;
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (user) {
      const order = (await PickUpUserInstance.create({
        id: orderUUID,
        pickupLocation,
        packageDescription,
        dropOffLocation,
        dropOffPhonenumber,
        offerAmount,
        paymentMethod: "",
        status: "pending",
        userId: user.id,
      })) as unknown as PickUpUserAttribute;
      res.status(201).json({
        message: "Order created successfully",
        order,
      });
      if (!order) {
        return res.status(400).json({
          message: "Unable to create order!",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/order-ride",
      msg: error,
    });
  }
};

//==========get all pending bids===========\\
export const getAllBiddings = async (req: JwtPayload, res: Response) => {
  try {
    let {limit,page} = req.query 
    limit = limit || 6;
    const offset = page? page*limit : 0;
    const currentPage = page? +page : 0;
   

    const bidding = await PickUpUserInstance.findAndCountAll({
      limit: limit, offset:offset, where: {status: "pending"}
    });

    const {count,rows} = bidding;
 const totalPages = Math.ceil(count / limit); 


    if (bidding) {
      return res.status(200).json({
        message: "You have successfully retrieved all pending bids",
        count,rows,currentPage,totalPages
      });
    }
    return res.status(400).json({
      Error: "Error retrieving biddings",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/all-biddings",
      message: err,
    });
  }
};

//==============accept bid==================\\
export const acceptBid = async (req: JwtPayload, res: Response) => {
    try{
        const {id} = req.user
        
        const bidding = await PickUpUserInstance.findOne({where: {id:id}})

        if (bidding){
            const updatedBidding = await PickUpUserInstance.update(
              { status: "accepted" },
              { where: { id: id } }
            );

            if (updatedBidding) {
                return res.status(200).json({message:"Rider has accepted your order"})
            }
        }
    }catch(err){
       res.status(500).json({
         Error: "Internal server Error",
         route: "/accept-bid",
         message: err,
       }); 
    }
}