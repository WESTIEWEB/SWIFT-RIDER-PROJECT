import supertest from "supertest";
import { db } from "../config/index";
import app from "../app";

const request = supertest(app);

//Test to get all orders for users
describe("Testing pickup user history", () => {

  beforeEach(async () => {
    await db.sync().then(() => console.log("Database is connected")).catch(err=>{
      console.log("Database is not connected")
    });
  })
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhOWFiZDNmLThjYWQtNGQyZi05YjViLTM3N2VmMmRiM2VjNCIsImVtYWlsIjoidGVuQHRlbi5jb20iLCJ2ZXJpZmllZCI6ZmFsc2UsImlhdCI6MTY3MzM4NTczNSwiZXhwIjoxNjczNDcyMTM1fQ.lb9bT6FjuLezaErhtPbrKuTwRo1Us8Lv2X-Uo6gXlcc"
  const wrongToken = "";

  it('When wrong token is passed', async () => {
    await request
    .get("/users/my-orders")
      .expect(401)
      .set({ authorization: `Bearer ${wrongToken}` })
      .then((response: any) => {
        expect(response.status).toBe(401)
      })
  })

  it('When right token is passed', async () => {
    await request
    .get("/users/my-orders")
      .expect(200)
      .set({ authorization: `Bearer ${token}` })
      .then((response: any) => {
        expect(response.body).toHaveProperty("message")
      })
  })
});