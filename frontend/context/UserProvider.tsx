"use client";
import React, { createContext, useContext, useState } from "react";

interface UserType {
    email: string,
    userName: string,
    id: string
}

interface UserContextInteface {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>
};

interface UserProviderProps {
    children?: React.ReactNode
}

const UserContext = createContext<UserContextInteface | null>(null);

export const useUser = () => {
    const state = useContext(UserContext);
    if (!state) throw new Error("State is undefined.");
    return state;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);
    return <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
}