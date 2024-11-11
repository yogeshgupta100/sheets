import jwt from "jsonwebtoken";

const verifyauthToken = (req, res, next) => {
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

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export { verifyauthToken };
