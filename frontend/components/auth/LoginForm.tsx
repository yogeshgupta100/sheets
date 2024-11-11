"use client";
import React, { useState } from 'react';
import axios from "axios";
import GridBackground from '../common/GridBackground';
import Link from 'next/link';
import { useUser } from '@/context/UserProvider';
import { useRouter } from 'next/navigation';

interface LogInFormProps {
}

const LogInForm: React.FC<LogInFormProps> = () => {
    const userStates = useUser();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            const updatedFormData = { ...prevFormData, [name]: value };
            return updatedFormData;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            console.log(formData);
            const logInresponse = await axios.post('http://localhost:4000/api/v1/user/loginEmail', {
                ...formData
            });
            console.log(logInresponse);
            if (logInresponse.status === 200) {
                console.log('LogIn successful!!!');
                console.log(logInresponse.data);

                if (userStates) {
                    userStates.setUser({
                        email: logInresponse.data.user.email,
                        id: logInresponse.data.user.id,
                        userName: logInresponse.data.user.userName
                    });
                };
                localStorage.setItem("token", logInresponse.data.authtoken);
                router.push("/");
            } else {
                console.log('LogIn failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className='relative w-[100dvw] h-[100dvh]'>
                <GridBackground />
                <div className="absolute left-0 top-0 flex flex-col w-[100dvw] h-[100dvh] items-center">
                    <div className="h-[100px] flex justify-between items-center bg-customRed-300 px-10 w-full">
                        <Link href={"/"}>
                            <div className="text-customRed-700 font-black tracking-[20px] text-6xl   montserrat-logo">SHEETS</div>
                        </Link>
                        <Link href={"/auth/signup"}>
                            <div className="px-5 bg-customRed-700 rounded-xl text-xl py-3 text-white font-bold">SIGN UP</div>
                        </Link>
                    </div>
                    <div className="h-full flex justify-center items-center pb-[100px]">
                        <div className="bg-customRed-500 p-5 rounded-xl flex flex-col gap-5 min-w-[400px]">
                            <div className='text-center'>
                                <h2 className='text-customRed-900 text-2xl bg-customRed-600 py-2 rounded-lg'>LOGIN</h2>
                            </div>
                            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                                <div className="">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter email or username...'
                                        className='outline-none'
                                    />
                                </div>
                                <div className="">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder='Enter Password...'
                                        className='outline-none'
                                    />
                                </div>
                                <div className="">
                                    <button type="submit" className='bg-customRed-900 text-xl'>LOGIN</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogInForm;

