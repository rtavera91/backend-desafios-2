//Testing del endpoint de productos
import { productsManager } from "../src/dao/managers/productManager.js";
import { expect } from "chai";
import "./db.js";

describe("Product Endpoint Tests", () => {
  let testProduct;

  beforeEach(async () => {
    testProduct = await productsManager.createOne({
      title: "Test",
      description: "Test",
      code: "Test123",
      price: 100,
      status: "Test",
      category: "Test",
      thumbnail: "Test",
    });
    console.log("Test product created", testProduct);
  });

  afterEach(async () => {
    try {
      if (testProduct) {
        await productsManager.deleteOne({ _id: testProduct._id });
      }
    } catch (error) {
      console.error("Error deleting test product", error);
    }
  });

  it("Should return the current list of products", async () => {
    const products = await productsManager.findAll();
    expect(products).to.be.an("array");
  });

  it("Should return the product with the id", async () => {
    const id = testProduct._id;
    const product = await productsManager.findById(id);
    expect(product).to.be.an("object");
  });
});
