import express from "express";
import { connectDB } from "./db/connectDB.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./swaggerOptions.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const specs = swaggerJsdoc(swaggerOptions);

const BASE_PATH = "/api/v1";
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/product`, productRoutes);
app.use(`${BASE_PATH}/category`, categoryRoutes);
app.use(`${BASE_PATH}/comment`, commentRoutes);
app.use(`${BASE_PATH}/settings`, settingsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`DB connected Successfully and listening to port ${PORT}`);
});
