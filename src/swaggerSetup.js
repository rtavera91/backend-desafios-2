import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "./utils.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API for Ecommerce - Coderhouse Backend",
      version: "1.0.1",
      description:
        "This is a REST API application made with Express. It retrieves data from MongoDB Atlas.",
    },
  },
  apis: [`${__dirname}/docs/*.yaml`],
};

export const swaggerSetup = swaggerJSDoc(swaggerOptions);
