import {GiExitDoor} from "react-icons/gi";
import Messages from "../customerService/Messages";
import {BsFillChatSquareDotsFill} from "react-icons/bs";

import axios from "axios";
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";


const StartConversation = ({setIsHandleSubmit, currentChat})=>{
    const {data:session}=useSession();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef=useRef()





    const {data:currentChatMessage}=useQuery({
        queryKey:["get-CurrentMessage"],
        queryFn:()=>{
            return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/${currentChat}`);
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

    return <>
        <div className="flex flex-col justify-between h-full">
            <div className="px-10 py-3 bg-tertiary flex flex-row justify-between items-center rounded-tr-xl rounded-tl-xl">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 ml-[-1rem]"><BsFillChatSquareDotsFill/> Canlı Destek
                    </div>
                </div>
                <div className="btn-primary flex items-center justify-center gap-2 mr-[-1.5rem]"
                onClick={()=>{setIsHandleSubmit(false)}}>
                    Exit
                    <span className="text-2xl"><GiExitDoor/></span>
                </div>
            </div>
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto mt-4 pr-2 scroll-smooth" ref={scrollRef}>
                {messages.map(m=>(
                    <Messages message={m} own={m.sender === session?.user.id} key={m._id} className={"text-secondary"}/>

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

        </div>
    </>
}
export default StartConversation;