import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./../swaggerOptions.js";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import commentRoutes from "./comment.routes.js";
import settingsRoutes from "./settings.routes.js";
import addressRoutes from "./address.routes.js";
import userRoutes from "./user.routes.js";
import orderRoutes from "./order.routes.js";
const router = Router();
const BASE_PATH = "/api/v1";

const specs = swaggerJsdoc(swaggerOptions);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
router.use(`${BASE_PATH}/auth`, authRoutes);
router.use(`${BASE_PATH}/products`, productRoutes);
router.use(`${BASE_PATH}/categories`, categoryRoutes);
router.use(`${BASE_PATH}/comments`, commentRoutes);
router.use(`${BASE_PATH}/settings`, settingsRoutes);
router.use(`${BASE_PATH}/addresses`, addressRoutes);
router.use(`${BASE_PATH}/users`, userRoutes);
router.use(`${BASE_PATH}/orders`, orderRoutes);

export default router;
