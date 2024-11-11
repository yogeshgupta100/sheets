import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

const saveCSVFile = async ({ sheetId }) => {
  try {
    const filePath = path.join(process.cwd(), "public", `${sheetId}.csv`);

    console.log({ filePath });

    const formData = new FormData();
    formData.append("sheetId", sheetId);
    formData.append("file", fs.createReadStream(filePath, "utf-8"), {
      filename: `${sheetId}.csv`,
      contentType: "text/csv"
    });

    const response = await axios.post(
      `${process.env.CDN_URL}/upload/sheet/add`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );

    console.log("File uploaded successfully:", response.data);
  } catch (err) {
    console.error("Error saving CSV file:", err.message);
  }
};

export { saveCSVFile };
