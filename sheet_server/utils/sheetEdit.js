import fs from "fs/promises"; // Use promises version of fs
import path from "path";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";
import { promisify } from "util";
import Queue from "async/queue.js";

const parseAsync = promisify(parse);
const stringifyAsync = promisify(stringify);

// Create a queue with a concurrency of 1 to ensure no concurrent writes
const fileQueue = new Map();

function getFileQueue(filePath) {
  if (!fileQueue.has(filePath)) {
    fileQueue.set(
      filePath,
      Queue(async (task, callback) => {
        try {
          await task();
          callback();
        } catch (error) {
          callback(error);
        }
      }, 1)
    );
  }
  return fileQueue.get(filePath);
}

export async function updateCsvFile(rowNum, colNum, data, sheetId) {
  try {
    rowNum = Number.parseInt(rowNum);
    colNum = Number.parseInt(colNum);
    console.log({ rowNum, colNum, data, sheetId });
    const filePath = path.join(process.cwd(), "public", `${sheetId}.csv`);
    console.log({ filePath });
    const queue = getFileQueue(filePath);

    queue.push(
      async () => {
        let fileData = "";

        try {
          fileData = await fs.readFile(filePath, "utf8");
        } catch (error) {
          console.warn(
            `File not found or error reading file at ${filePath}. Treating as empty file.`
          );
        }

        let rows = [];

        if (fileData) {
          try {
            rows = await parseAsync(fileData, {
              columns: false,
              skip_empty_lines: false
            });
          } catch (parseError) {
            console.error("Error parsing CSV file:", parseError.message);
            rows = [];
          }
        }

        console.log({ rowAfterRead: rows });

        // Ensure the rows array has enough rows
        if (rows.length <= rowNum) {
          while (rows.length <= rowNum) {
            rows.push([]);
          }
        }

        console.log({ rowAfterRowsAppend: rows });

        // Ensure each row has enough columns
        rows.forEach((row) => {
          while (row.length <= colNum) {
            row.push("");
          }
        });

        console.log({ rowAfterColsAppend: rows });

        // Update the specific cell
        rows[rowNum][colNum] = data;
        console.log("Updated rows:", rows);

        let outputCsv = "";

        try {
          outputCsv = await stringifyAsync(rows, { header: false });
        } catch (stringifyError) {
          console.error(
            "Error converting rows to CSV format:",
            stringifyError.message
          );
          return;
        }

        try {
          await fs.writeFile(filePath, outputCsv);
          console.log("CSV file updated successfully");
        } catch (writeError) {
          console.error("Error writing to CSV file:", writeError.message);
        }
      },
      (err) => {
        if (err) {
          console.error("Error processing queue task:", err.message);
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
}

// import fs from "fs";
// import path from "path";
// import { parse } from "csv-parse";
// import { stringify } from "csv-stringify";
// import Queue from "async/queue.js";

// // Create a queue with a concurrency of 1 to ensure no concurrent writes
// const fileQueue = new Map();

// function getFileQueue(filePath) {
//   if (!fileQueue.has(filePath)) {
//     fileQueue.set(
//       filePath,
//       Queue(async (task, callback) => {
//         await task();
//         callback();
//       }, 1)
//     );
//   }
//   return fileQueue.get(filePath);
// }

// export async function updateCsvFile(rowNum, colNum, data, sheetId) {
//   try {
//     rowNum = Number.parseInt(rowNum);
//     colNum = Number.parseInt(colNum);
//     console.log({ rowNum, colNum, data, sheetId });
//     const filePath = path.join(process.cwd(), "public", `${sheetId}.csv`);
//     console.log({ filePath });
//     const queue = getFileQueue(filePath);

//     await queue.push(() => {
//       try {
//         let fileData = "";

//         try {
//           fileData = fs.readFileSync(filePath, "utf8");
//         } catch (error) {
//           console.warn(
//             `File not found or error reading file at ${filePath}. Treating as empty file.`
//           );
//         }

//         let rows = [];

//         if (fileData) {
//           try {
//             parse(
//               fileData,
//               { columns: false, skip_empty_lines: false },
//               (err, output) => {
//                 if (err) throw err;
//                 rows = output;
//               }
//             );
//           } catch (parseError) {
//             console.error("Error parsing CSV file:", parseError.message);
//             rows = [];
//           }
//         }

//         console.log({ rowAfterRead: rows });

//         if (rows.length <= rowNum) {
//           while (rows.length <= rowNum) {
//             rows.push([]);
//           }
//         }

//         console.log({ rowAfterRowsAppend: rows });

//         rows.forEach((row) => {
//           while (row.length <= colNum) {
//             row.push("");
//           }
//         });

//         console.log({ rowAfterColsAppend: rows });

//         rows[rowNum][colNum] = data;

//         console.log("Updated rows:", rows);

//         let outputCsv = "";

//         try {
//           stringify(rows, { header: false }, (err, output) => {
//             if (err) throw err;
//             outputCsv = output;
//           });
//         } catch (stringifyError) {
//           console.error(
//             "Error converting rows to CSV format:",
//             stringifyError.message
//           );
//           return;
//         }

//         try {
//           fs.writeFileSync(filePath, outputCsv);
//           console.log("CSV file updated successfully");
//         } catch (writeError) {
//           console.error("Error writing to CSV file:", writeError.message);
//         }

//         // let fileData = "";

//         // try {
//         //   fileData = await fs.readFile(filePath, "utf8");
//         // } catch (error) {
//         //   console.warn(
//         //     `File not found or error reading file at ${filePath}. Treating as empty file.`
//         //   );
//         // }

//         // let rows = [];

//         // if (fileData) {
//         //   try {
//         //     rows = await new Promise((resolve, reject) => {
//         //       parse(
//         //         fileData,
//         //         { columns: false, skip_empty_lines: false },
//         //         (err, output) => {
//         //           if (err) return reject(err);
//         //           resolve(output);
//         //         }
//         //       );
//         //     });
//         //   } catch (parseError) {
//         //     console.error("Error parsing CSV file:", parseError.message);
//         //     rows = []; // Initialize as empty array if parsing fails
//         //   }
//         // }
//         // console.log({ rowAfterRead: rows });
//         // // Ensure the rows array has enough rows
//         // if (rows.length <= rowNum) {
//         //   while (rows.length <= rowNum) {
//         //     rows.push([]);
//         //   }
//         // }

//         // console.log({ rowAfterRowsAppend: rows });
//         // // Ensure each row has enough columns
//         // rows.forEach((row) => {
//         //   while (row.length <= colNum) {
//         //     row.push(""); // Add a new empty column
//         //   }
//         // });

//         // console.log({ rowAfterColsAppend: rows });
//         // // Update the specific cell
//         // rows[rowNum][colNum] = data;

//         // console.log("Updated rows:", rows);

//         // const outputCsv = await new Promise((resolve, reject) => {
//         //   stringify(rows, { header: false }, (err, output) => {
//         //     if (err) return reject(err);
//         //     resolve(output);
//         //   });
//         // });

//         // await fs.writeFile(filePath, outputCsv);
//         // console.log("CSV file updated successfully");
//       } catch (err) {
//         console.error("Error processing file:", err.message);
//       }
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// // Example usage:
