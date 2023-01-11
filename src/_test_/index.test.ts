import supertest from 'supertest';
import postgres from 'sequelize';
import app from '../app';
import { db } from '../config';

let token: string[];

// require("dotenv").config();

const request = supertest(app);
beforeAll(async() => {
    await db.sync().then(() => {
        console.log('DB connected successfully')
    })
});

describe('Post/Get/Update/Delete', () => {
    describe('get route', () => {
        it('get rider-history should return 200', async ()=>{
          await supertest(app).get('/riders/rider-history')
            expect(200) 
        })}
        )}
)