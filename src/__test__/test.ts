import supertest from "supertest";
import { db } from "../config/index";
import app from "../app";

const request = supertest(app);
let token: string[];
//Test to get all orders for users
describe("Testing rider accept order", () => {

  beforeEach(async () => {
    await db.sync().then(() => console.log("DB connected successfully")).catch(err=>{
      console.log("DB connected successfully")
    });
  })
  

  it('When rider acceps order', async () => {
    await request
    .get("/riders/rider-order-profile/81aefa7c-2fd8-4240-b57b-2f774202fbc5")
      .expect(200)
      .set('Accept', 'application/json')
      .then((response: any) => {
        expect(response.body).toHaveProperty("message")
      })
  })
});

describe("Testing rider accept order", () => {

  beforeEach(async () => {
    await db.sync().then(() => console.log("DB connected successfully")).catch(err=>{
      console.log("DB connected successfully")
    });
  })
  

  it('When rider acceps order', async () => {
    await request
    .get("/riders/rider-order-profile/81aefa7c-2fd8-4240-b57b-2f774202fbc5")
      .expect(200)
      .set('Accept', 'application/json')
      .then((response: any) => {
        expect(response.body).toHaveProperty("message")
      })
  })
});