import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const db = new Sequelize("app", "", "", {
  storage: "./rider.postgres",
  dialect: "postgres",
  logging: false,
});

export const APP_SECRET = process.env.APP_SECRET!;
