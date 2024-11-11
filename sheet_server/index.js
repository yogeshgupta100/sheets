import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { fetchSheet } from "./utils/sheetFetch.js";
import { updateCsvFile } from "./utils/sheetEdit.js";
import { saveCSVFile } from "./utils/sheetSave.js";

dotenv.config();

fetchSheet();

const port = process.env.PORT ?? 3000;
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server({
  cors: "*"
});
app.use(cors());
io.attach(server);

const sheetUsed = new Set();

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  socket.on("event:dataEdit", async (datastrem) => {
    try {
      const { data } = datastrem;
      const { row, col, val, sheetId } = data;
      console.log({ row, col, val, sheetId });
      console.log({ data });
      sheetUsed.add(sheetId);
      await updateCsvFile(row, col, val, sheetId);
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("disconnect", () => {
    try {
      for (let sheetid of sheetUsed) {
        saveCSVFile({ sheetId: sheetid });
      }
    } catch (error) {
      console.log(error.message);
    }
    console.log("Socket Disconnect");
  });
});

server.listen(port, () => {
  console.log(`🐳 Docker Server Is Running on ${port}`);
});
