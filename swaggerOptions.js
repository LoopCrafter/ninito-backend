const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description:
        "this is a simple API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3450/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
      schemas: {},
      responses: {},
    },
    security: [{ ApiKeyAuth: [] }],
  },
  apis: ["./swagger-docs.js"],
};

export default options;
