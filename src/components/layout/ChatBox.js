import {BsChatRightTextFill} from "react-icons/bs";

import React, {useEffect, useState} from "react";
import StartConversation from "../chatBox/startConversation";

import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import PacmanLoader from "react-spinners/PacmanLoader";

import axios from "axios";

const ChatBox = () => {

    const [chatUI, setChatUI] = useState(false);
    const [routerPushLogin, setRouterPushLogin] = useState(false);
    const [userInfo, setUserInfo] = useState("");

    const [options,setOptions]=useState([
        {"0":"--Konu Seçiniz--"},
        {"1":"Teknik Destek"},
        {"2":"Fatura Sorunu"},
        {"3":"Ürün İade"},
        {"4":"Diğer"}
    ]);
    const [selectedOption, setSelectedOption] = useState('');
    const [message, setMessage] = useState('');
    const {data: session} = useSession();
    const router = useRouter();


    useEffect(() => {
        const getUser = async () => {
            if (session?.user?.id) {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user?.id}`)
                setUserInfo(res.data)
            }
        }
        getUser();
    }, [session]);




    const loginFirstRouter = () => {
        setRouterPushLogin(true);
        const id = setTimeout(() => {
            router.push('/auth/login');
            setRouterPushLogin(false);
        }, 1000);

        router.events.on('routeChangeStart', () => {
            setRouterPushLogin(true);
            clearTimeout(id);
        });
        router.events.on('routeChangeComplete', () => {
            setRouterPushLogin(false);
        });
    }


    const handleSubmit=(e)=>{
        e.preventDefault();
        const chatValue={
            userId:userInfo._id,
            fullName:userInfo.name,
            email:userInfo?.email,
            image:userInfo.image,
            process:selectedOption,
            message:message
        }
        console.log(chatValue)
    }

    const enableForm = ()=>{
        if(message.length >10 && selectedOption>0 && selectedOption<=4){
            console.log("true")
        return false;
        }
        console.log("false")
        return true;
    }
    useEffect(()=>{enableForm()},[message, selectedOption])
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
                    className={`absolute bottom-[2.6rem] right-[6rem] text-base px-4 py-0 border-primary bg-[#FFC547] border-2 rounded-2xl whitespace-nowrap animate-bounce ${!userInfo && "hidden"}`}>
                    {userInfo ? ` Merhaba ${userInfo.fullName?.split(" ")[0]}` : `hoş geldiniz`}
                </div>
            )
        }

        {chatUI &&
            (
                <div
                    className="absolute h-[32rem] w-[23rem] bg-white md:bottom-[6.25rem] bottom-[5.625rem] md:right-12 right-[1rem] border-4 rounded-2xl border-primary z-0"
                    style={{background: "linear-gradient(340deg, rgba(255,255,255,1) 45%, rgba(255,190,51,1) 45%)"}}
                >

                    {!userInfo ?
                        (
                            <>
                                <div
                                    className={`${routerPushLogin ? "hidden" : "absolute top-7 w-full h-full flex flex-col justify-center items-center gap-20"}`}>
                                    <div className="flex absololute text-tertiary text-2xl max-w-[12rem] text-center font-bold">
                                        Welcome to my Support
                                        <span className="absolute top-[7.2rem] left-[14.5rem] text-3xl animate-waving-hand">🖐️</span>
                                    </div>
                                    <div>
                                        <div
                                            className="border-primaryBold border-[3px] rounded-lg px-6 py-1 text-2xl font-bold cursor-pointer "
                                            onClick={loginFirstRouter}
                                        >
                                            Login
                                        </div>
                                    </div>
                                    <div className="text-primary text-2xl max-w-[14rem] text-center font-bold "> You can
                                        contact us after you log in
                                    </div>
                                </div>
                                <div
                                    className={` ${routerPushLogin ? "relative w-full h-full after:w-full after:h-full flex flex-col justify-center items-center  after:content['']  after:bg-white after:opacity-40 after:z-40 " : "hidden z-0"}`}>
                     <span className="absolute  justify-self-center  item-self z-50">
                                  <PacmanLoader
                                      color="#FFB81F"
                                      cssOverride={{}}
                                      loading
                                      margin={2}
                                      size={50}
                                      speedMultiplier={1}
                                  />
                     </span>
                                </div>
                            </>
                        )
                        :
                        (
                            <StartConversation setChatUI={setChatUI} chatUI={chatUI} userInfo={userInfo} handleSubmit={handleSubmit} setSelectedOption={setSelectedOption} options={options} enableForm={enableForm} setMessage={setMessage} message={message}/>
                        )
                    }

                </div>
            )}
    </>
}
export default ChatBox;
