import { exec } from "child_process";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runCommand = (command, options) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Standard error: ${stderr}`);
      }
      console.log(`Standard output: ${stdout}`);
      resolve(stdout);
    });
  });
};

const createNewSheetForAGivenUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const newSheet = await prisma.sheet.create({
      data: {
        userId: userId,
        sheetName: "Untitled"
      }
    });
    return res
      .status(200)
      .json({ message: "New Sheet Created Successfully", sheet: newSheet });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error.", error: error.message });
  }
};


const getAllSheetsOfUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    const allSheets = await prisma.sheet.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        lastOpenTime: "desc"
      }
    });

    return res
      .status(200)
      .json({ message: "All Sheets Of Given User", sheets: allSheets });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const changeNameOfSheet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { sheetId, sheetName } = req.body;
    const sheet = await prisma.sheet.findFirst({
      where: {
        id: sheetId
      }
    });
    // console.log({ sheet.id, userId });
    // console.log(sheet.)
    if (sheet.userId !== userId)
      return res.status(404).json({ message: "Illegal Access." });
    await prisma.sheet.update({
      where: {
        id: sheetId
      },
      data: {
        sheetName: sheetName
      }
    });
    return res
      .status(200)
      .json({ message: "Name of sheet changes successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const deleteSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const deleteSheetResponse = await prisma.sheet.delete({
      where: {
        id: sheetId
      }
    });
    return res.status(200).json({
      message: "Sheet Deleted Successfully",
      sheet: deleteSheetResponse
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getMetaDataOfSheetId = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const sheetData = await prisma.sheet.findFirst({
      where: {
        id: sheetId
      }
    });
    return res.status(200).json({
      message: "Sheet data!!!",
      sheet: sheetData
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export {
  createNewSheetForAGivenUser,
  getAllSheetsOfUsers,
  changeNameOfSheet,
  deleteSheet,
  getMetaDataOfSheetId
};
