import axios from "axios";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fetchSheet = async () => {
  try {
    const cdnUrl = `${process.env.CDN_URL}/sheets/${process.env.SHEET_ID}.csv`;
    const fileName = process.env.SHEET_ID;
    const filePath = path.join(__dirname, "../", "public", `${fileName}.csv`);
    
    const response = await axios.get(cdnUrl, { responseType: "arraybuffer" });

    fs.writeFile(filePath, response.data, (err) => {
      if (err) {
        console.error("Error saving file:", err);
        return;
      }
      console.log(`File saved to ${filePath}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

export { fetchSheet };
