const request = require("supertest");
const app = require("../server"); // Ensure this points to your Express app
let accessToken = ""; // This will store the token
let refreshToken = ""; // This will store the refresh token

describe("Authentication Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      firstname: "test",
      lastname: "test",
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    accessToken = res.body.accessToken; // Store access token
    refreshToken = res.body.refreshToken; // Store refresh token
  });

  it("should log in a user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");

    accessToken = res.body.accessToken; // Update token
    refreshToken = res.body.refreshToken;
  });
});

describe("Post Routes", () => {
  it("should create a new post", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`) // Set the token in the request
      .send({
        userId: "1",
        caption: "This is my new post",
        imageUrl: "https://example.com/image.jpg",
      });

    expect(res.statusCode).toEqual(201);
  });

  it("should get all posts", async () => {
    const res = await request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
  });

  it("should get a specific user's posts", async () => {
    const res = await request(app)
      .get("/posts/user/1") // Adjust to match your actual route
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
  });

  it("should delete a post", async () => {
    const res = await request(app)
      .delete("/posts/2") // Adjust the ID as needed
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(404);
  });
});

describe("Like Routes", () => {
  it("should like a post", async () => {
    const res = await request(app)
      .post("/like/1/like") // Adjust the ID as needed
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        userId: "1",
      });

    expect(res.statusCode).toEqual(201);
    console.log(res.body);
  });

  it("should unlike a post", async () => {
    const res = await request(app)
      .delete("/like/1/unlike") // Adjust the ID as needed
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        userId: "1",
      });
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
  });
});

describe("Token Refresh", () => {
  it("should refresh the access token", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .send({ token: refreshToken });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");

    accessToken = res.body.accessToken; // Update access token
  });
});
