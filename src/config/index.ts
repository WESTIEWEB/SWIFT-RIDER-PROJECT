import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const db = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASSWORD as string, {
    host: "localhost",
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false
});

export const AccountSid = process.env.AccountSid;
export const authToken = process.env.AuthToken;
export const fromAdminPhone = process.env.fromAdminPhone;
export const APP_SECRET = process.env.APP_SECRET as string;

export interface UserPayload {
    id: string;
    email:string;
}