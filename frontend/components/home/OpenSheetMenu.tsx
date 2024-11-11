"use client";
import { useUser } from "@/context/UserProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";

interface SheetMetaDataUnitType {
  id: string;
  sheetName: string;
  createdAt: Date;
  updatedAt: Date;
  lastOpenTime: Date;
  userId: string;
}

interface SheetMetaDataUnitBarProps {
  id: string;
  sheetName: string;
  createdAt: Date;
  updatedAt: Date;
  lastOpenTime: Date;
  userId: string;
  currentUserId: string;
  setSheetDeleted: React.Dispatch<React.SetStateAction<boolean>>
}

interface OpenSheetMenuProps {
  userId: string | null;
}

const SheetMetaDataUnitBar: React.FC<SheetMetaDataUnitBarProps> = ({
  sheetName,
  lastOpenTime,
  userId,
  currentUserId,
  id,
  setSheetDeleted
}) => {
  const [dateString, setDateString] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const da = new Date(lastOpenTime);
    setDateString(da.toLocaleDateString());
  }, [lastOpenTime]);


  const handleEdit = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!id || !token)
        return;
      const sheetDeleteResponse = await axios.delete(
        `http://localhost:4000/api/v1/sheet/sheet/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (sheetDeleteResponse.status === 200) {
        console.log(sheetDeleteResponse.data.message);
        setSheetDeleted((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = () => {
    console.log("Edit button clicked");
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="grid relative grid-cols-3 py-3 items-center bg-customRed-100 rounded-full">
        <Link href={`/${id}`}>
          <div className="flex gap-2 items-center pl-20 cursor-pointer">
            <div className="bg-customRed-200 p-2 rounded-xl">
              <FaPlus color="#fff" size={30} />
            </div>
            <div className="text-xl">{sheetName}</div>
          </div>
        </Link>
        <div className="text-center text-xl">
          {currentUserId === userId ? "ME" : "OTHER"}
        </div>
        <div className="text-center text-xl">
          {dateString ? dateString : " "}
        </div>
        <div
          className="text-center text-xl absolute right-10 cursor-pointer"
          onClick={handleEdit}
        >
          <HiDotsVertical color="#000" size={30} />
        </div>
        {isDropdownOpen && (
          <div ref={dropdownRef} className="z-10 absolute right-10 mt-14 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
            <button onClick={handleEditClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
            <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</button>
          </div>
        )}
      </div>
    </>
  );
};

const OpenSheetMenu: React.FC<OpenSheetMenuProps> = ({ userId }) => {
  const [allSheetsMetaData, setAllSheetsMetaData] = useState<
    SheetMetaDataUnitType[]
  >([]);
  const router = useRouter();
  const userStates = useUser();
  const [sheetDeleted, setSheetDeleted] = useState<boolean>(false);

  const fetchAllSheetsMetaData = useCallback(async () => {
    try {
      if (!userId) return;
      const allSheetsMetaDataResponse = await axios.get(
        `http://localhost:4000/api/v1/sheet/data/${userId}`
      );
      if (allSheetsMetaDataResponse.status === 200) {
        setAllSheetsMetaData(allSheetsMetaDataResponse.data.sheets);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }, [userId]);

  useEffect(() => {
    fetchAllSheetsMetaData();
  }, [fetchAllSheetsMetaData, sheetDeleted]);

  const handleTokenLogin = useCallback(async () => {
    try {
      if (userId === null) {
        const token = localStorage.getItem("token");
        if (!token || token === undefined) router.push("/auth");
        const handleTokenLoginResponse = await axios.get(
          "http://localhost:4000/api/v1/user/loginToken",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (handleTokenLoginResponse.status === 200) {
          console.log(handleTokenLoginResponse.data);
          if (userStates) {
            userStates.setUser({
              email: handleTokenLoginResponse.data.user.email,
              id: handleTokenLoginResponse.data.user.id,
              userName: handleTokenLoginResponse.data.user.userName,
            });
            localStorage.setItem(
              "token",
              handleTokenLoginResponse.data.authToken
            );
          } else {
            router.push("/auth");
          }
        } else {
          router.push("/auth");
        }
      }
    } catch (error: any) {
      router.push("/auth");
      console.log(error.message);
    }
  }, [router, userId, userStates]);

  useEffect(() => {
    handleTokenLogin();
  }, [handleTokenLogin]);

  return (
    <>
      <div className="px-10 ">
        <div className="bg-customRed-300 p-5 rounded-xl min-h-[600px] flex flex-col gap-3">
          <div className="grid grid-cols-3 bg-customRed-50 py-5 rounded-lg">
            <div className="text-customRed-800 text-3xl font-black text-center">
              SHEET
            </div>
            <div className="text-customRed-800 text-3xl font-black text-center">
              OWNED BY
            </div>
            <div className="text-customRed-800 text-3xl font-black text-center">
              LAST OPENED
            </div>
          </div>
          {userId &&
            allSheetsMetaData.map((sheetunit) => {
              return (
                <SheetMetaDataUnitBar
                  key={sheetunit.id}
                  id={sheetunit.id}
                  createdAt={sheetunit.createdAt}
                  lastOpenTime={sheetunit.lastOpenTime}
                  sheetName={sheetunit.sheetName}
                  updatedAt={sheetunit.updatedAt}
                  userId={sheetunit.userId}
                  currentUserId={userId}
                  setSheetDeleted={setSheetDeleted}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default OpenSheetMenu;
