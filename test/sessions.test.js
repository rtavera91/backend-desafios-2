import { expect } from "chai";
import { usersManager } from "../src/dao/managers/usersManager.js";
import { generateToken } from "../src/utils.js";
import "./db.js";

describe("Session Endpoint Tests", () => {
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

  it("Should generate a valid token for the user", async () => {
    const userDB = await usersManager.findByEmail(testUser.email);
    const token = generateToken({ id: userDB._id, role: userDB.role });
    expect(token).to.be.a("string");
    expect(token).to.not.be.empty;
  });
});
