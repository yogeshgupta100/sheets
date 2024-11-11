"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface messageType {
    sheetId: string,
    row: number,
    col: number,
    val: string
}

interface IoSocketContext {
    setSocketConnectionString: React.Dispatch<React.SetStateAction<String>>;
    sendMessage: (data: messageType) => any;
}

interface SocketProviderProps {
    children?: React.ReactNode;
}

const SocketContext = createContext<IoSocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error("State is undefined");
    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [socketConnectionString, setSocketConnectionString] = useState<String>("");

    const sendMessage: IoSocketContext['sendMessage'] = useCallback((data) => {
        console.log(`Sending Message`, data);
        if (socket)
            socket.emit("event:dataEdit", { data: data });
    }, [socket]);


    useEffect(() => {
        if (socket === undefined)
            setSocketConnectionString("");
    }, [socket]);

    useEffect(() => {
        let _socket: Socket;
        if (socketConnectionString !== "") {
            _socket = io(`http://localhost:8000`);
            setSocket(_socket);
        }

        return () => {
            if (_socket)
                _socket.disconnect();
            setSocket(undefined);
        }
    }, [socketConnectionString]);

    return (
        <SocketContext.Provider value={{ setSocketConnectionString, sendMessage }}>
            {children}
        </SocketContext.Provider>
    );
};