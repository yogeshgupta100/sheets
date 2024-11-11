import { Router } from "express";
import {
  changeNameOfSheet,
  createNewSheetForAGivenUser,
  deleteSheet,
  getAllSheetsOfUsers,
  getMetaDataOfSheetId
} from "../controllers/sheet.controller.js";
import { verifyauthToken } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to sheets Route" });
});

router.get("/create/:userId", createNewSheetForAGivenUser);
router.get("/data/:userId", getAllSheetsOfUsers);
router.put("/data/:userId", verifyauthToken, changeNameOfSheet);
// router.get("/sheet/run/:sheetId", verifyauthToken, runSheetContainer);
router.get("/data/sheet/:sheetId", verifyauthToken, getMetaDataOfSheetId);
router.delete("/sheet/:sheetId", verifyauthToken, deleteSheet);

export default router;
