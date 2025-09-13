import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import commentRoutes from "./comment.routes.js";
import settingsRoutes from "./settings.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./../swaggerOptions.js";

const router = Router();
const BASE_PATH = "/api/v1";

const specs = swaggerJsdoc(swaggerOptions);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
router.use(`${BASE_PATH}/auth`, authRoutes);
router.use(`${BASE_PATH}/product`, productRoutes);
router.use(`${BASE_PATH}/category`, categoryRoutes);
router.use(`${BASE_PATH}/comment`, commentRoutes);
router.use(`${BASE_PATH}/settings`, settingsRoutes);

export default router;
