import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const SocketIo = () => {
    const [socket, setSocket] = useState();
    const [input, setInput] = useState("");
    const [arrivalMessage,setArrivalMessage]=useState(null);
    const [messages,setMessages]=useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        const socketInitializer = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/socketio`);
            const newSocket = io("ws://localhost:3000");
            setSocket(newSocket);

            newSocket.on("connect", (data) => {
                console.log(data);
                console.log("connected");
            });

            newSocket.on("update-input", (msg) => {
                setInput(msg);
            });

            // newSocket.on("getMessage",data=>{
            //     setArrivalMessage({
            //         sender:data.senderId,
            //         text:data.text,
            //         createdAt:Date.now()
            //     });
            // })
        };
        socketInitializer();


    }, []);
    useEffect(()=>{
        arrivalMessage && setMessages(prev =>[...prev,arrivalMessage]);
    },[arrivalMessage])

    useEffect(() => {
        if (socket && session?.user?.id) {
            socket.emit("addUser", session?.user?.id);
            socket.on("getUsers",users=>{
                console.log("users",users)
            })
        }
    }, [session, socket]);

    const onChangeHandler = (e) => {
        setInput(e.target.value);
        socket.emit("input-change", e.target.value);
        socket.emit("sendMessage",{
            senderId:session?.user.id,
            reciverId:"null",
            text:"Hello"
        })
    };

    return <>
        <input
            placeholder="Type something"
            value={input}
            onChange={onChangeHandler}
        />

    </>
};

export default SocketIo;