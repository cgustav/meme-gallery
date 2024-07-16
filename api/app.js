// app.js
const express = require("express");
const bodyParser = require("body-parser");
const memesRoutes = require("./src/routes/memes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");
const config = require("./config");

const app = express();
const port = config.PORT || 3001;

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Meme Gallery API",
      version: "1.0.0",
      description: "API for managing a gallery of memes",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use("/memes", memesRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Inicio del servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
