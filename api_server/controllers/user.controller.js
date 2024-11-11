import prisma from "../services/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleSignUpByUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    console.log({ userName, email, password });

    const regex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

    if (!regex.test(email)) {
      return res.status(400).json({ message: "Email Is Not Of Correct Form" });
    }

    if (password.length < 8)
      return res.status(400).json({ message: "Password length is small." });

    const finalUserName = userName.toLowerCase();

    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log({ hashPassword });

    const userCreateResponse = await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
        userName: finalUserName
      }
    });

    return res.status(200).json({
      message: "Sign Up Successful",
      user: userCreateResponse
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const handleSignInByEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { userName: email }]
      }
    });


    if (!bcrypt.compare(user.password, password))
      return res
        .status(400)
        .json({ message: "Details Seems to be incorrect." });

    const authtoken = jwt.sign({ id: user.id }, process.env.JSONWEBTOKEN, {
      expiresIn: "3 days"
    });

    user.password = null;

    return res.status(200).json({
      message: "Successfully Login",
      user: user,
      authtoken: authtoken
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const handleSignInByToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
      return res
        .status(401)
        .json({ message: "Token missing or improperly formatted" });
    }

    const token = tokenParts[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JSONWEBTOKEN);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired, please log in again." });
      } else if (err.name === "JsonWebTokenError") {
        return res
          .status(403)
          .json({ message: "Invalid token, please log in again." });
      } else {
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
    }

    const user = await prisma.user.findFirst({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    delete user.password;

    const authToken = jwt.sign({ id: user.id }, process.env.JSONWEBTOKEN, {
      expiresIn: "3 days"
    });

    return res
      .status(200)
      .json({ message: "Log in successfully", user, authToken });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getUserDataFromUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    if (!user) return res.status(404).json({ message: "UserId is Invalid." });
    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export {
  handleSignUpByUser,
  handleSignInByEmail,
  handleSignInByToken,
  getUserDataFromUserId
};
