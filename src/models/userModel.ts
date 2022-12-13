import { db } from "../config/index";
import { DataTypes, Model } from "sequelize";

export interface UserAttribute {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
}

export class UserInstance extends Model<UserAttribute> {}

UserInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is Required",
        },
        notEmpty: {
          msg: "Input your name",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "phone number is required",
        },
        notEmpty: {
          msg: "Provide a Phone number",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email adress",
        },
        isEmail: {
          msg: "Please input a valid email",
        },
      },
    },
  },
  {
    sequelize: db,
    tableName: "user",
  }
);
