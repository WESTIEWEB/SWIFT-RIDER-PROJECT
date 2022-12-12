import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
export * from "./db"  
dotenv.config();

export const db = new Sequelize('app', '', '', {
    storage: "./rider.postgres",
    dialect: "postgres",
    logging: false
});