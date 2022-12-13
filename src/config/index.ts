import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const db = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASSWORD as string, {
    host: "localhost",
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false
});

export const APP_SECRET = process.env.APP_SECRET as string
export const GMAIL_USER = process.env.Gmail_user
export const GMAIL_PASS = process.env.Gmail_pass

export const FromAdminMail = process.env.FromAdminMail as string
export const userSubject = process.env.userSubject as string