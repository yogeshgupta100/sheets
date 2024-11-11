"use client";
import { useUser } from "@/context/UserProvider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  const userStates = useUser();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleProfile = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (userStates)
      userStates.setUser(null);
    router.push("/auth/login");
    // window.location.href = "/auth/login";
  };

  return (
    <>
      <div className="grid grid-cols-3 items-center bg-customRed-300 px-10 py-3 w-full">
        <Link href={"/"}>
          <div className="text-customRed-700 font-black tracking-[20px] text-6xl montserrat-logo">
            SHEETS
          </div>
        </Link>
        <div className="flex items-center bg-white px-3 rounded-xl py-1">
          <div>
            <IoSearch size={32} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="text-lg outline-none border-none bg-transparent"
          />
        </div>
        <div className="flex justify-end">
          <div
            className="flex items-center gap-2 bg-white rounded-full p-2 cursor-pointer relative"
            onClick={handleProfile}
            ref={buttonRef}
          >
            <Image
              src={"/images/profile_user.png"}
              alt="profile_icon"
              width={100}
              height={100}
              className="rounded-full w-[40px] h-[40px] object-cover"
            />
            {userStates?.user && (
              <div className="text-2xl pr-2">{userStates.user.userName}</div>
            )}
          </div>
        </div>
        <div
          ref={dropdownRef}
          className={`${isDropdownOpen
            ? "z-10 h-auto opacity-100"
            : "-z-10 h-0 overflow-hidden opacity-0"
            } w-40 transition-all duration-100 ease-in-out absolute top-4 right-10 mt-14 bg-white border border-gray-300 rounded-lg shadow-lg p-2`}
        >
          <Link href={"/"}>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Home
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
