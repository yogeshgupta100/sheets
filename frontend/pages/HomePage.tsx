"use client";
import Navbar from '@/components/common/Navbar'
import OpenSheetMenu from '@/components/home/OpenSheetMenu';
import { useUser } from '@/context/UserProvider';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { FaPlus } from "react-icons/fa6";

const HomePage = () => {
    const userStates = useUser();
    const router = useRouter();
    const handleNewSheetGenerate = useCallback(async () => {
        try {
            if (!userStates || !userStates.user)
                return;
            console.log(userStates.user);
            const newSheetGenerateResponse = await axios.get(
                `http://localhost:4000/api/v1/sheet/create/${userStates.user.id}`
            );
            if (newSheetGenerateResponse.status === 200) {
                console.log("new sheet generated with id", newSheetGenerateResponse.data.sheet.id);
                router.push(`/${newSheetGenerateResponse.data.sheet.id}`)
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }, [userStates, router]);
    return (
        <>
            <Navbar />
            <div className="pl-20 py-10 ">
                <button onClick={handleNewSheetGenerate} className='w-fit hover:bg-customRed-100'>
                    <div className="flex items-center gap-3 cursor-pointer">
                        <div className="bg-customRed-200 p-2 rounded-xl">
                            <FaPlus color='#fff' size={40} />
                        </div>
                        <div className="font-bold text-4xl text-customRed-600">CREATE SHEET</div>
                    </div>
                </button>
            </div>
            {
                <OpenSheetMenu userId={userStates ? userStates.user ? userStates.user.id : null : null} />
            }
        </>
    )
}

export default HomePage
