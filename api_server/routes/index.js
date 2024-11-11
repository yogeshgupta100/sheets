import { Router } from "express";
import userRoute from "./user.route.js";
import sheetRoute from "./sheet.route.js";
const router = Router();

router.use("/user", userRoute);
router.use("/sheet", sheetRoute);

export default router;
