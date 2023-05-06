import {BsChatRightTextFill} from "react-icons/bs";
import React, {useEffect, useState} from "react";
import InfoConversation from "../chatBox/infoConversation";
import {useSession} from "next-auth/react";



import axios from "axios";
import UserNoLogin from "../chatBox/userNoLogin";
import StartConversation from "../chatBox/startConversation";

const ChatBox = () => {

    const [chatUI, setChatUI] = useState(false); //false
    const [currentChat, setCurrentChat] = useState(null);
    const [isHandleSubmit,setIsHandleSubmit]=useState(false); //false
    const [userInfo, setUserInfo] = useState("");
    const {data: session} = useSession();

    useEffect(() => {
        const getUser = async () => {
            if (session?.user?.id) {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user?.id}`)
                setUserInfo(res.data)
            }
        }
        getUser();
    }, [session]);


    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown, false);

        return () => {
            document.removeEventListener("keydown", handleKeyDown, false);
        };
    }, []);

    const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            setChatUI(false);
        }
    };
    //console.log("currentChat",currentChat)

    return <>
        <div className=" fixed btn-primary !w-12 !h-12  !p-0 md:bottom-10 bottom-8 md:right-10 right-3 md:text-4xl text-5xl
     flex items-center justify-center hover:!opacity-30"
             onClick={() => setChatUI(!chatUI)}
        >

    <span className="absolute left-[11.1px]  text-2xl hover:opacity-10"
    > <BsChatRightTextFill/></span>
        </div>
        {
            chatUI && (
                <div
                    className={`absolute md:bottom-[2.6rem] bottom-[2.3rem] md:right-[6rem] right-[4rem] text-base px-4 py-0 border-primary bg-[#FFC547] border-2 rounded-2xl whitespace-nowrap animate-bounce ${!userInfo && "hidden"}`}>
                    {userInfo ? ` Merhaba ${userInfo.fullName?.split(" ")[0]}` : `hoş geldiniz`}
                </div>
            )
        }

        {/*Kart Böllümü*/}
        {chatUI && (
                <div
                    className="absolute md:h-[32rem] md:w-[23rem] h-[36rem] w-[23rem] bg-white md:bottom-[6.25rem] bottom-[5.625rem] md:right-12 right-[1rem] border-4 rounded-2xl border-primary z-0"
                    style={{background: `linear-gradient(340deg, rgba(255,255,255,1) ${userInfo ? "30%"  : "45%"}, rgba(255,190,51,1) 45%)`}}
                >
                    {isHandleSubmit ? (<StartConversation setIsHandleSubmit={setIsHandleSubmit} currentChat={currentChat}/>)
                    : ( !userInfo ? (<UserNoLogin/>):
                        (<InfoConversation setChatUI={setChatUI}
                                           chatUI={chatUI}
                                           userInfo={userInfo}
                                           setIsHandleSubmit={setIsHandleSubmit}
                                           setCurrentChat={setCurrentChat}
                        />)
                    )}
                </div>
            )}
    </>
}
export default ChatBox;
