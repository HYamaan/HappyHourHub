import React, {useState} from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Title from "../UI/Title";

import PacmanLoader from "react-spinners/PacmanLoader";
import axios from "axios";
import {toast} from "react-toastify";


const CancelOrder=({setCancelOrder,user,order})=>{

    const [isLoading,setIsLoading]=useState(false);
    const [desc, setDescription] = useState("");
    const [reasonText,setReasonText]=useState("");
    const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];
    const handleCrate= async ()=>{
        try {
            const cancel= await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment/cancel?paymentSuccessId=${order.paymentSuccessId}`,{
                userIp:user.ip,
                orderId:order._id,
                conversationId:order.conversationId,
                reason:reasonText,
                description:desc
            });
            if (cancel.status===200){
                toast.success("Siparişiniz iptal edilmiştir")
            }

        }catch (err){
            toast.error(err?.response?.data?.message)
            console.log(err);
        }
    }


    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen z-40
            after:w-screen after:h-screen after:bg-white after:absolute after:top-0 after:left-0 after:opacity-60 grid place-content-center">
            {!isLoading ?
                (  <OutsideClickHandler onOutsideClick={() => setCancelOrder(false)}>
                    <div className="w-full h-full grid place-content-center relative">
                        <div className="relative z-50 md:w-[600px] w-72  bg-white border-2 lg:p-10 p-3 rounded-3xl">
                            <Title className="lg:text-[40px] text-xl text-center capitalize">why do you want to cancel</Title>

                            <div className="flex flex-col text-sm my-2">

                                <span className="font-semibold mb-2 capitalize">Reason</span>
                                <select id="select"
                                        value={reasonText}
                                        onChange={(e) => setReasonText(e.target.value)}
                                        className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-opacity-50 shadow-2xl shadow-cadetGray"

                                >
                                    {reasonEnum.map((option,index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>))}
                                </select>

                                <span className="font-semibold mb-2 capitalize"> Write a description</span>
                                <textarea
                                    rows="3"
                                    className="border-2 p-1 text-sm px-1 outline-none"
                                    placeholder="Write a description..."
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>



                            <div className="flex justify-center lg:justify-end">
                                <button className="btn-primary  "
                                        onClick={handleCrate}>Sipariş İptali
                                </button>
                            </div>


                        </div>
                    </div>
                </OutsideClickHandler>)
                :
                (<div className="flex justify-center items-center mt-3 z-50">
                    <PacmanLoader
                        color="#fff200"
                        cssOverride={{}}
                        loading
                        margin={2}
                        size={36}
                        speedMultiplier={1}
                    />
                </div>)}
        </div>);

}
export default CancelOrder;