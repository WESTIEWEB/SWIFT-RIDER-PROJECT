import { DataTypes, Model } from "sequelize";
import { db } from "../config";
export interface PickUpUserAttribute {
  id: string;
  pickupLocation: string;
  packageDescription: string;
  dropOffLocation: string;
  dropOffPhonenumber: string;
  offerAmount: Number;
  paymentMethod: string;
  status: string;
  userId: string;
}
export class PickUpUserInstance extends Model<PickUpUserAttribute> {}
PickUpUserInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "pick up location is required",
        },
        notEmpty: {
          msg: "provide a pickup location",
        },
      },
    },
    packageDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "package description is required",
        },
        notEmpty: {
          msg: "provide package description",
        },
      },
    },
    dropOffLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Drop of location is required",
        },
        notEmpty: {
          msg: "provide drop of location",
        },
      },
    },
    dropOffPhonenumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Drop off phone number is required",
        },
        notEmpty: {
          msg: "provide a drop off phone number",
        },
      },
    },
    offerAmount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "order",
  }
);
