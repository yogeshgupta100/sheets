import React from "react";
import Image from "next/image";

const SheetRecord = () => {
  return (
    <div className="flex justify-between items-center py-3 border-t border-gray-300 pl-8 pr-8">
      <div className="flex items-center w-[30%] text-left">
        <Image
          src="/images/image4.png"
          alt="Spreadsheet"
          width={24}
          height={24}
          className="mr-4"
        />
        <span className="font-medium">Untitled spreadsheet</span>
      </div>
      {/* <div className="flex items-center space-x-8"> */}
        <span className="w-[30%] text-left">me</span>
        <span className="w-[30%] text-left">13:30</span>
      {/* </div> */}
    </div>
  );
};

export default SheetRecord;
