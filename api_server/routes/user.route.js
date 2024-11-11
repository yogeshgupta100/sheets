import { Router } from "express";
import {
  handleSignInByEmail,
  handleSignUpByUser,
  handleSignInByToken,
  getUserDataFromUserId
} from "../controllers/user.controller.js";
const router = Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to user route." });
});

router.post("/register", handleSignUpByUser);
router.post("/loginEmail", handleSignInByEmail);
router.get("/loginToken", handleSignInByToken);
router.get("/data/:userId", getUserDataFromUserId);

export default router;
