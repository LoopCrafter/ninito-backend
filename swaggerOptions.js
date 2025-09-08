const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ninito API",
      version: "1.0.0",
      description: "this is a API Application for Ninitoo.ir shop",
    },
    servers: [
      {
        url: "http://localhost:8090/api/v1",
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
