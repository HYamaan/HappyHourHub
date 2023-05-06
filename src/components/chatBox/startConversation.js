import {GiExitDoor} from "react-icons/gi";
import Messages from "../customerService/Messages";
import {BsFillChatSquareDotsFill} from "react-icons/bs";

import axios from "axios";
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";


const StartConversation = ({setIsHandleSubmit, currentChat})=>{
    const {data:session}=useSession();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage,setArrivalMessage]=useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [userOnline,setUserOnline]=useState(false);
    const scrollRef=useRef()

    //------------------------------------------------------------------------------
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInitializer = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/socketio`);
            const newSocket = io();

            newSocket.on("connect", () => {
                console.log("connected");
                setSocket(newSocket);
            });
            //Send Message SocketIO
            newSocket.on("getMessage",data=>{
                setArrivalMessage({
                    senderId:data.senderId,
                    text:data.text,
                    createdAt:Date.now(),
                })
            })
        };
        socketInitializer();
    }, []);
    //Add socketIO session?.user?.id
    useEffect(() => {
        if (socket && session.user.id) {
            socket.emit("addUser", session?.user?.id);
            socket.on("getUsers", (users) => {
                setOnlineUsers(users)
                // setTimeout(()=>{console.log("users",users.some(u=>u.userId === session.user.id))},2000)
            });
        }
    }, [session?.user?.id, socket]);


    //arivalMessage to newMessage
    useEffect(()=>{
        if(socket){
            arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.senderId) &&
            setMessages((prev)=>[...prev,arrivalMessage])
        }
    },[arrivalMessage,currentChat])


    useEffect(()=>{
        const isOnline = onlineUsers.some(obj => obj.userId === session?.user?.id);
        setUserOnline(isOnline)
    },[session?.user?.id,onlineUsers])
    console.log(userOnline)



//____________________________________________________________________

    const {data:currentChatMessage}=useQuery({
        queryKey:["get-CurrentMessage"],
        queryFn:()=>{
            return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/${currentChat._id}`);
        },
        select:(data)=>{
          return data.data
        },
        refetchOnMount:true,
        refetchOnWindowFocus:true

    })
    useEffect(()=> {
        if (currentChatMessage){
            setMessages(currentChatMessage);
        }
    },[currentChatMessage])

    const handleSubmit=async (e)=>{
        e.preventDefault();
        const message = {
            senderId:session?.user?.id,
            text:newMessage,
            conversationId:currentChat
        }
        console.log("members",currentChat.members)
        const receiverId = currentChat.members.find(member=> member !== session?.user?.id)
        socket.emit("sendMessage",{
            senderId:session?.user?.id,
            receiverId,
            text:newMessage
        });

        try {
            const res= await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages`,message)
            setNewMessage("")
            setMessages((prev)=>[...prev,res.data])
        }catch (err){
            console.log(err);
        }

    }
    const handleKeyDown = (event) => {
            if (event.key === "Enter" && newMessage.trim() !=="") {
                handleSubmit(event);
            }

    };
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const enableForm = () => {
        return newMessage.length <= 1;
    };
    const handleExitClick=()=>{
        setIsHandleSubmit(false);
        if (socket) {
            socket.disconnect();
        }
    }

    return <>
        <div className="flex flex-col justify-between h-full">
            <div className="px-10 py-3 bg-tertiary flex flex-row justify-between items-center rounded-tr-xl rounded-tl-xl">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 ml-[-1rem]"><BsFillChatSquareDotsFill/> Canlı Destek
                    </div>
                </div>
                <div className="btn-primary flex items-center justify-center gap-2 mr-[-1.5rem]"
                onClick={handleExitClick}>
                    Exit
                    <span className="text-2xl"><GiExitDoor/></span>
                </div>
            </div>
            {userOnline ? (
                <>
                    <div className="max-h-[calc(100vh-16rem)] overflow-y-auto mt-4 pr-2 scroll-smooth" ref={scrollRef}>
                        {messages.map((m,index)=>(
                            <Messages message={m} own={m.sender === session?.user.id} key={m._id ? m._id :index} className={"text-secondary"}/>

                        ))}
                    </div>
                    <div className="flex items-center justify-center mb-3">
                        <textarea id="message" name="message" className="w-[80%] h-12 border-2 border-primary mx-2
                        focus:outline-none  resize-none" placeholder="write something..."
                                  onChange={(e)=>setNewMessage(e.target.value)}
                                  value={newMessage}
                                  onKeyDown={(e)=>handleKeyDown(e)}
                        >
                        </textarea>
                        <button type="submit" disabled={enableForm()} className={`mt-2 mr-1 py-2 btn-primary w-[6rem] ${enableForm() && 'opacity-50 cursor-not-allowed'}`}
                                onClick={handleSubmit}
                                onKeyDown={(e)=>handleKeyDown(e)}>
                            Send
                        </button>
                    </div>
                </>
            ) : (<span
                className="absolute  mx-auto top-[12rem] text-[3.125rem] opacity-60 text-secondary text-center cursor-default">
                Görüşme Sonlandırıldı.
                <span className="absolute top-[9.2rem] left-[7.5rem] text-[6.5rem] animate-waving-hand contrast-[0.9] brightness-[1.1] saturate-200">🖐️</span>
            </span>)
            }

        </div>
    </>
}
export default StartConversation;