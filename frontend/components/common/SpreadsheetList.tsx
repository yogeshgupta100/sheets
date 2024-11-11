import Image from "next/image";
import SheetRecord from "./SheetRecord";

export default function SpreadsheetList() {
  const records = Array.from({ length: 10 });
  return (
    <div className=" bg-[#dae3ff]">
      <div className="w-[100%] h-[1.5px] bg-black "></div>
      <div className="flex flex-col bg-[#dae3ff]  ml-8 pb-4 pt-4 ">
        <span className="text-[1.3rem] pb-4 font-medium text-[#1f316f]">
          Start a new spreadsheet
        </span>
        <div className="bg-white w-[8rem] h-[8rem] flex items-center justify-center">
          <Image
            src="/images/image4.png"
            alt="New Spreadsheet"
            width={48}
            height={48}
          />
        </div>
        <span className="text-[1.3rem] pt-4 font-medium text-[#1f316f]">
          Blank spreadsheet
        </span>
      </div>
      <div className="w-[100%] h-[1.5px] bg-black "></div>
      <div className="">
        <div className="flex justify-around pt-2 pb-2 pl-8 pr-8">
          <span className="w-[30%] text-left" >Today</span>
          <span className="w-[30%] text-left">Owned by anyone</span>
          <span className="w-[30%] text-left">Last opened by me</span>
        </div>
        <div className="w-[100%] h-[0.5px] bg-black "></div>
        <div className="bg-[#f4f6fc] pl-8 pr-8">
          {records.map((_, index) => (
            <SheetRecord key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
