"use client";
import React, { useState } from 'react';
import GridBackground from '../common/GridBackground';
import Link from 'next/link';
import { useRouter } from "next/navigation"
import axios from 'axios';

interface SignupFormProps {
}

const SignupForm: React.FC<SignupFormProps> = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [name]: value };
      if (name === 'password' || name === 'confirmPassword') {
        setPasswordMatchError(updatedFormData.password !== updatedFormData.confirmPassword);
      }
      return updatedFormData;
    });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!passwordMatchError) {
      if (formData.password.length < 8) {
        console.log('Password must be at least 8 characters long.');
      }
      try {
        console.log(formData);
        const response = await axios.post('http://localhost:4000/api/v1/user/register', {
          ...formData
        });
        
        console.log(response);

        if (response.status === 200) {
          console.log('Signup successful!');
          router.push("/auth/login");
        } else {
          console.log('Signup failed. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        console.log('An error occurred. Please try again.');
      }
    } else {
      console.log('Password and confirm password must match.');
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
            <Link href={"/auth/login"}>
              <div className="px-5 bg-customRed-700 rounded-xl text-xl py-3 text-white font-bold">LOG IN</div>
            </Link>
          </div>
          <div className="h-full flex justify-center items-center pb-[100px]">
            <div className="bg-customRed-500 p-5 rounded-xl flex flex-col gap-5 min-w-[400px]">
              <div className='text-center'>
                <h2 className='text-customRed-900 text-2xl bg-customRed-600 py-2 rounded-lg'>SIGNUP</h2>
              </div>
              <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                <div className="">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    placeholder='Enter username...'
                    className='outline-none'
                  />
                </div>
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
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder='Enter Password...'
                    className='outline-none'
                  />
                </div>
                {passwordMatchError && <p>Password and confirm password must match.</p>}
                <div className="">
                  <button type="submit" className='bg-customRed-900 text-xl'>SIGNUP</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
