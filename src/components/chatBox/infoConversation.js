import {BsFillChatSquareDotsFill} from "react-icons/bs";
import {useEffect, useState} from "react";
import axios from "axios";

const InfoConversation=({userInfo,setChatUI,chatUI,setIsHandleSubmit,setCurrentChat})=>{


    const [selectedOption, setSelectedOption] = useState('');
    const [message, setMessage] = useState('');
    const [options,setOptions]=useState([
        {"0":"--Konu Seçiniz--"},
        {"1":"Teknik Destek"},
        {"2":"Fatura Sorunu"},
        {"3":"Ürün İade"},
        {"4":"Diğer"}
    ]);




    const handleSubmit=async (e)=>{
        e.preventDefault();
        const chatValue={
            senderId:userInfo._id,
            fullName:userInfo.fullName,
            userEmail:userInfo.email,
            topic:selectedOption,
        }

        //console.log("userInfo",userInfo)
        //console.log("chatValue",chatValue)
        try {
            const res=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/conversation`,chatValue)
            console.log("RESS",res.data._id);
            const messages={
                conversationId:res.data._id,
                senderId:userInfo._id,
                text:message
            }
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages`,messages)
            setCurrentChat(res.data._id)
            setIsHandleSubmit(true);
        }catch (err){
            console.log(err);
        }
    }
    const enableForm = ()=>{
        if(message.length >10 && selectedOption>0 && selectedOption<=4){
            return false;
        }
        return true;
    }
    useEffect(()=>{enableForm()},[message, selectedOption])
    return <>
        <div className="flex flex-col">
            <div className="flex flex-row py-4 px-6 justify-between items-center border-b-2 ">
                <div className="flex items-center gap-3"><BsFillChatSquareDotsFill/> Canlı Destek
                </div>
                <div
                    className="border border-2 rounded-full h-5 w-5 flex items-center justify-center text-3xl cursor-pointer"
                    onClick={() => setChatUI(!chatUI)}
                >
                    <span className="mb-[5px] ml-[1px]">-</span>
                </div>
            </div>
            <div className="text-xs mt-4 mr-5 flex flex-col gap-1  ">
                <span>HappyHourHup Canlı Desteke hoş geldiniz! </span>
                <span>Lütfen sohbete başlamadan önce aşağıdaki formu doldurunuz.</span>
            </div>

            <div className="flex flex-col mt-2 w-60 border-b-2 ">
                <span className="text-sm">Ad Soyad</span>
                <span> {userInfo.fullName}</span>
            </div>
            <div className="flex flex-col mt-2 w-60 border-b-2 ">
                <span className="text-sm">E-Posta Adresi</span>
                <span> {userInfo.email}</span>
            </div>
            <div className="mt-2">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="support-topic" className="text-sm font-light block mb-1">
                            Hangi konuda destek almak istiyorsunuz?
                        </label>
                        <select
                            id="support-topic"
                            name="support-topic"
                            className="block w-[97%] bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 shadow-2xl shadow-indigo-500/50"
                            onChange={(event)=>{ setSelectedOption(event.target.value);}}
                        >
                            {options.map((option, index) => {
                                const optionKey = Object.keys(option)[0];
                                const optionValue = option[optionKey];

                                return <option key={index} value={optionKey}>{optionValue}</option>;
                            })}
                        </select>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="message" className="text-sm font-light block mb-1">Mesajınız:</label>
                        <textarea id="message" name="message" className="block w-[97%] h-32 border-2 border-primary
                                             focus:outline-none shadow-[0_10px_20px_-15px_rgba(0,0,0,0.3)] shadow-secondary resize-none" value={message} onChange={(event)=>{
                            setMessage(event.target.value)}
                        }></textarea>
                    </div>
                    <div className="flex items-center justify-center ">
                        <button type="submit" disabled={enableForm()} className={`mt-2 btn-primary !w-9/12 ${enableForm() && 'opacity-50 cursor-not-allowed'}`}>
                            Konuşmayı Başlat
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </>
}
export default InfoConversation;