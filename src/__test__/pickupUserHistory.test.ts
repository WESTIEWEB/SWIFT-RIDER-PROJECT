import supertest from "supertest";
import { db } from "../config/index";
import app from "../app";

const request = supertest(app);

beforeAll(async () => {
  await db.sync().then(() => console.log("Database is connected"));
});

describe("Testing pickup user history", () => {
  it("When wrong userId is used", async () => {
    //Arrange and act
    const res = await request.get("/my-orders");

    expect(res.status).toBe(404);
  });
});

describe("Testing pickup user history", () => {
  it("Order details should contain an array", async () => {
    //Arrange and act
    const res = await request.get("/my-orders");

    expect(res).toEqual(expect.arrayContaining([]));
  });
});
