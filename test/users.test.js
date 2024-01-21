import { usersManager } from "../src/dao/managers/usersManager.js";
import { expect } from "chai";
import "./db.js";

describe("User Endpoint Tests", () => {
  let testUser;

  beforeEach(async () => {
    testUser = await usersManager.createOne({
      first_name: "Test",
      last_name: "User",
      email: "testuser2@mail.com",
      password: "test123456",
    });
    console.log("Test user created", testUser);
  });

  afterEach(async () => {
    try {
      if (testUser) {
        await usersManager.deleteOne({ _id: testUser._id });
      }
    } catch (error) {
      console.error("Error deleting test user", error);
    }
  });

  it("Should return the current list of users", async () => {
    const users = await usersManager.findAll();
    expect(users).to.be.an("array");
  });

  it("Should return the user with the email", async () => {
    const email = testUser.email;
    const user = await usersManager.findByEmail(email);
    expect(user).to.be.an("object");
    expect(user).to.have.property("email", email);
  });
});
