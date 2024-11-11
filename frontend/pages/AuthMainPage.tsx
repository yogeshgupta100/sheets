import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import GridBackground from '@/components/common/GridBackground';

const AuthMainPage = () => {
    return (
        <>
            <div className="w-[100dvw] h-[100dvh] relative">
                <GridBackground />
                <div className="absolute top-0 left-0 flex flex-col w-full h-full">
                    <div className="h-[100px] flex justify-between items-center bg-customRed-300 px-10">
                        <Link href={"/"}>
                            <div className="text-customRed-700 font-black tracking-[20px] text-6xl   montserrat-logo">SHEETS</div>
                        </Link>
                        <Link href={"/auth/login"}>
                            <div className="px-5 bg-customRed-700 rounded-xl text-xl py-3 text-white font-bold">SIGN IN</div>
                        </Link>
                    </div>
                    <div className="h-full py-[80px] flex flex-col gap-20 justify-between">
                        <div className="flex justify-center">
                            <div className="flex flex-col items-end">
                                <div className="bg-customRed-700 text-white px-5 rounded-xl tracking-[20px] text-[150px] montserrat-logo font-normal leading-[150px]" style={{
                                    fontWeight: "normal"
                                }}>SHEETS</div>
                                <div className="text-2xl text-customRed-300">BY TEHC BLUNDER</div>
                            </div>
                        </div>
                        <div className="text-[70px] flex justify-center font-thin text-customRed-800">ONLINE, COLLABORATIVE SPREADSHEETS</div>
                        <div className="flex justify-center gap-40">
                            <Link href={"/auth/login"}>
                                <div className="px-5 py-3 rounded-xl text-2xl bg-customRed-800 text-white">LOGIN</div>
                            </Link>
                            <Link href={"/auth/signup"}>
                                <div className="px-5 py-3 rounded-xl text-2xl bg-customRed-800 text-white">SIGN UP</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthMainPage
