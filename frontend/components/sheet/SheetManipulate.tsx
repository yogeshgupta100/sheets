"use client";
import { useUser } from '@/context/UserProvider';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

interface SheetMetaDataUnitType {
    id: string;
    sheetName: string;
    createdAt: Date;
    updatedAt: Date;
    lastOpenTime: Date;
    userId: string;
}

interface SheetManipulateProps {
    setNewRowcount: React.Dispatch<React.SetStateAction<number>>;
    setNewColcount: React.Dispatch<React.SetStateAction<number>>;
    newRowcount: number;
    newColcount: number;
    sheetId: string
}

const SheetManipulate: React.FC<SheetManipulateProps> = ({
    setNewRowcount,
    setNewColcount,
    newRowcount,
    newColcount,
    sheetId
}) => {
    const [sheetMetaData, setSheetMetaData] = useState<SheetMetaDataUnitType | null>(null);
    const [sheetName, setSheetName] = useState<string>("");
    const userStates = useUser();

    const fetchMetaDataOfGivenSheetId = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token || !sheetId)
                return;
            const fetchMetaDataOfGivenSheetIdResponse = await axios.get(
                `http://localhost:4000/api/v1/sheet/data/sheet/${sheetId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            if (fetchMetaDataOfGivenSheetIdResponse.status === 200)
                setSheetMetaData(fetchMetaDataOfGivenSheetIdResponse.data.sheet);
        } catch (error) {
            console.log(error);
        }
    }, [sheetId])

    const updateSheetName = useCallback(async () => {
        try {
            if (!sheetMetaData || !userStates)
                return;
            if (sheetMetaData.sheetName === sheetName)
                return;
            const timer = setTimeout(async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!userStates.user)
                        return;
                    const updateSheetNameResponse = await axios.put(
                        `http://localhost:4000/api/v1/sheet/data/${userStates.user.id}`,
                        {
                            sheetId, sheetName
                        },
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    );
                    if (updateSheetNameResponse.status === 200)
                        fetchMetaDataOfGivenSheetId();
                } catch (error) {
                    console.log(error);
                }
            }, 100);
            return () => {
                clearTimeout(timer);
            }
        } catch (error) {
            console.log(error);
        }
    }, [sheetName, sheetId]);

    useEffect(() => {
        updateSheetName();
    }, [updateSheetName]);

    useEffect(() => {
        if (sheetMetaData)
            setSheetName(sheetMetaData.sheetName);
    }, [sheetMetaData]);

    useEffect(() => {
        fetchMetaDataOfGivenSheetId();
    }, [fetchMetaDataOfGivenSheetId]);

    const handleRowIncrease = () => {
        setNewRowcount(prev => prev + 1);
    };

    const handleColIncrease = () => {
        setNewColcount(prev => prev + 1);
    };

    const handleRowDecrease = () => {
        if (newRowcount > 0) {
            setNewRowcount(prev => prev - 1);
        }
    };

    const handleColDecrease = () => {
        if (newColcount > 0) {
            setNewColcount(prev => prev - 1);
        }
    };

    return (
        <div className='grid grid-cols-3 bg-customRed-900 py-3 px-5 text-white text-xl items-center'>
            <div className='flex items-center justify-center'>
                <input type="text" placeholder='Sheet Name' value={sheetName} onChange={(e) => {
                    setSheetName(e.target.value);
                }} className='text-black outline-none' />
            </div>
            <div className='flex justify-center gap-8'>
                <span className='flex gap-4 items-center'>
                    <button
                        onClick={handleRowIncrease}
                        className='cursor-pointer text-center border text-2xl bg-black text-white rounded-md hover:bg-[#343434]'
                    >
                        +
                    </button>
                    <span className='py-1'>Row</span>
                    <button
                        onClick={handleRowDecrease}
                        className='cursor-pointer text-center border text-2xl bg-black text-white rounded-md hover:bg-[#343434]'
                    >
                        -
                    </button>
                </span>
                <span className='flex gap-4 items-center'>
                    <button
                        onClick={handleColIncrease}
                        className='cursor-pointer text-center border text-2xl bg-black text-white rounded-md hover:bg-[#343434]'
                    >
                        +
                    </button>
                    <span className='py-1'>Col</span>
                    <button
                        onClick={handleColDecrease}
                        className='cursor-pointer text-center border text-2xl bg-black text-white rounded-md h-fit hover:bg-[#343434]'
                    >
                        -
                    </button>
                </span>
            </div>
            <div></div>
        </div>
    );
}

export default SheetManipulate;
