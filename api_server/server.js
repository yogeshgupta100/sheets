import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { logger } from "./services/logger.js";

dotenv.config();

const port = process.env.PORT ?? 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan("short", {
    stream: { write: (message) => logger.info(message.trim()) }
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome To Server" });
});

import routes from "./routes/index.js";

app.use("/api/v1", routes);

app.use("/", (req, res) => {
  res.send({ message: "Unknown Route" }).status(404);
});

app.listen(port, () => {
  console.log(`Main Excel Server Is Running ON ${port}...`);
});
