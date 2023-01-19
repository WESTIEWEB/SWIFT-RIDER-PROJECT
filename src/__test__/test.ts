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
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhOWFiZDNmLThjYWQtNGQyZi05YjViLTM3N2VmMmRiM2VjNCIsImVtYWlsIjoidGVuQHRlbi5jb20iLCJ2ZXJpZmllZCI6ZmFsc2UsImlhdCI6MTY3MzU5NjE5NiwiZXhwIjoxNjczNjgyNTk2fQ.6qEI1Jc_-LtKTa36MzlucOEmZ4twOiytHif4VYJ_sNw"
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