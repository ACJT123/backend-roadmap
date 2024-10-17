const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("POST /api/user/sign-up", () => {
  // clear the user collection before each test
  beforeEach(async () => {
    await mongoose.connection.collection("users").deleteMany({});
  });

  it("Should save user to database", async () => {
    const res = await request(app).post("/api/user/sign-up").send({
      email: "testing@gmail.com",
      password: "testingpassword",
    });

    expect(res.status).toBe(201);
  });

  it("Should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/user/sign-up").send({
      password: "testingpassword",
    });

    expect(res.status).toBe(400);
  });

  it("Should return 400 if password is missing", async () => {
    const res = await request(app).post("/api/user/sign-up").send({
      email: "testing@gmail.com",
    });

    expect(res.status).toBe(400);
  });

  it("Should return 400 if both email and password are missing", async () => {
    const res = await request(app).post("/api/user/sign-up").send({});

    expect(res.status).toBe(400);
  });

  it("Should not save user to database if user already exists", async () => {
    // create a user
    await request(app).post("/api/user/sign-up").send({
      email: "testing@gmail.com",
      password: "testingpassword",
    });

    const res = await request(app).post("/api/user/sign-up").send({
      email: "testing@gmail.com",
      password: "testingpassword",
    });

    expect(res.status).toBe(500);
  });
});

describe("POST /api/user/login", () => {
  // clear the user collection before each test
  beforeEach(async () => {
    await mongoose.connection.collection("users").deleteMany({});
  });

  it("Should login user", async () => {
    // create a user
    await request(app).post("/api/user/sign-up").send({
      email: "testing@gmail.com",
      password: "testingpassword",
    });

    const res = await request(app).post("/api/user/login").send({
      email: "testing@gmail.com",
      password: "testingpassword",
    });

    expect(res.status).toBe(201);
  });

  it("Should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/user/login").send({
      password: "testingpassword",
    });

    expect(res.status).toBe(400);
  });

  it("Should return 400 if password is missing", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "testing@gmail.com",
    });

    expect(res.status).toBe(400);
  });

  it("Should return 400 if both email and password are missing", async () => {
    const res = await request(app).post("/api/user/login").send({});

    expect(res.status).toBe(400);
  });
});
