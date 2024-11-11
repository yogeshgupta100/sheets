"use client"

import React, { useRef, useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from "react";
import { handleCsvData } from "@/api/fetchCsv";
import axios from "axios";
import { useSocket } from "@/context/SocketProvider";
import SheetManipulate from "@/components/sheet/SheetManipulate";
import Image from "next/image";

interface SheetProps {
  sheetId: string
}

const Sheet: React.FC<SheetProps> = ({ sheetId }) => {
  const { setSocketConnectionString, sendMessage } = useSocket();
  const [numRows, setNumRows] = useState<number>(10);
  const [numCols, setNumCols] = useState<number>(10);
  const [newRowcount, setNewRowcount] = useState<number>(0);
  const [newColcount, setNewColcount] = useState<number>(0);
  const [charNum, setCharNum] = useState<number>(65);
  const [cellsData, setCellsData] = useState<string[][]>([]);
  const timers = useRef<number[]>([]);
  const inputRefs = useRef<Array<Array<HTMLInputElement | null>>>([]);
  const [isDockerRunning, setDockerRunning] = useState<boolean>(false);

  const fetchCsvData = useCallback(async () => {
    if (!sheetId) return;
    const csvData = await handleCsvData({ sheetId });
    if (csvData.length !== 0) setCellsData(csvData);
  }, [sheetId]);

  useEffect(() => {
    let maxLen = 10;
    cellsData.map((row) => {
      maxLen = Math.max(maxLen, row.length);
    });
    setNumCols(maxLen);
    if (cellsData.length < 100) setNumRows(100);
    else setNumRows(cellsData.length);
  }, [cellsData]);

  useEffect(() => {
    fetchCsvData();
  }, [fetchCsvData]);

  const handleInputChange = useCallback(
    (row: number, col: number, value: string) => {
      const newCells = [...cellsData];
      for (let i = cellsData.length; i < row + 1; i++) {
        newCells.push(Array.from<string>({ length: numCols }).fill(""));
      }
      newCells[row][col] = value;
      setCellsData(newCells);
    },
    [cellsData, numCols]
  );

  const handleDebouncedInputChange = useCallback(
    (row: number, col: number, value: string) => {
      const index = row * numCols + col;
      if (timers.current[index]) {
        clearTimeout(timers.current[index]);
      }

      handleInputChange(row, col, value);
      timers.current[index] = window.setTimeout(() => {
        sendMessage({ col: col, row: row, val: value, sheetId: sheetId });
      }, 600);
    },
    [handleInputChange, numCols, sendMessage, sheetId]
  );

  const handleEnterPress = (
    e: KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (e.key === "Enter") {
      const nextRow = rowIndex + 1;
      if (inputRefs.current[nextRow] && inputRefs.current[nextRow][colIndex]) {
        inputRefs.current[nextRow][colIndex]?.focus();
      } else {
        setNewRowcount(prev => prev + 1);
        inputRefs.current[rowIndex][colIndex]?.focus();
      }
    }
  };

  const handleDockerSpinUp = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!sheetId || !token) return;
      setSocketConnectionString(sheetId);
      const dockerSpinUpResponse = await axios.get(
        `http://localhost:4000/api/v1/sheet/sheet/run/${sheetId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (dockerSpinUpResponse.status === 200) {
        setDockerRunning(true);
        console.log(dockerSpinUpResponse.data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }, [sheetId, setSocketConnectionString]);

  useEffect(() => {
    handleDockerSpinUp();
  }, [handleDockerSpinUp]);

  const renderCharacter = useCallback((colIndex: number) => {
    if (charNum + colIndex <= 90) {
      return String.fromCharCode(charNum + colIndex - 1);
    }
    return String.fromCharCode((charNum + colIndex) % 91 + 65);
  }, [charNum]);

  return (
    <>
      <SheetManipulate
        setNewRowcount={setNewRowcount}
        setNewColcount={setNewColcount}
        newRowcount={newRowcount}
        newColcount={newColcount}
        sheetId={sheetId}
      />
      <div
        className={`sheet grid`}
        style={{
          gridTemplateRows: `repeat(${numRows + newRowcount + 1}, 1fr)`,
        }}
      >
        {Array.from({ length: numRows + newRowcount + 1 }).map(
          (row, rowIndex) => (
            <div
              className="row"
              key={rowIndex}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols + newColcount + 1}, 1fr)`,
              }}
            >
              {Array.from({ length: numCols + newColcount + 1 }).map(
                (cell, colIndex) => {
                  if (!inputRefs.current[rowIndex]) {
                    inputRefs.current[rowIndex] = [];
                  }
                  if (rowIndex === 0 && colIndex === 0)
                    return <div className="box" key={colIndex}></div>;
                  else if (rowIndex === 0) {
                    return (
                      <div
                        className="box flex justify-center items-center text-lg"
                        key={colIndex}
                      >
                        {renderCharacter(colIndex)}
                      </div>
                    );
                  }
                  else if (colIndex === 0) {
                    return (
                      <div
                        className="box flex justify-center items-center text-lg"
                        key={colIndex}
                      >
                        {rowIndex}
                      </div>
                    );
                  }
                  else if (
                    rowIndex < cellsData.length &&
                    colIndex < cellsData[rowIndex].length
                  ) {
                    if (!inputRefs.current[rowIndex]) {
                      inputRefs.current[rowIndex] = [];
                    }

                    return (
                      <div className="box" key={colIndex}>
                        <input
                          type="text"
                          value={
                            rowIndex < cellsData.length &&
                              colIndex < cellsData[rowIndex].length
                              ? cellsData[rowIndex][colIndex]
                              : ""
                          }
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleDebouncedInputChange(rowIndex, colIndex, e.target.value)
                          }
                          onKeyDown={(e) => handleEnterPress(e, rowIndex, colIndex)}
                          ref={(el) => {
                            inputRefs.current[rowIndex][colIndex] = el;
                          }}
                        />
                      </div>
                    );
                  } else {
                    if (!inputRefs.current[rowIndex]) {
                      inputRefs.current[rowIndex] = [];
                    }

                    return (
                      <div className="box" key={colIndex}>
                        <input
                          type="text"
                          value={
                            rowIndex < cellsData.length &&
                              colIndex < cellsData[rowIndex].length
                              ? cellsData[rowIndex][colIndex]
                              : ""
                          }
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleDebouncedInputChange(rowIndex, colIndex, e.target.value)
                          }
                          onKeyDown={(e) => handleEnterPress(e, rowIndex, colIndex)}
                          ref={(el) => {
                            inputRefs.current[rowIndex][colIndex] = el;
                          }}
                        />
                      </div>
                    );
                  }
                }
              )}
            </div>
          )
        )}
      </div>
      {
        !isDockerRunning &&
        <div className="absolute top-0 left-0 w-[100dvw] h-[100dvh] bg-[#ff6d6ddd] flex items-center justify-center overflow-hidden">
          <div className="spinner"></div>
        </div>
      }
    </>
  );
};

export default Sheet;
