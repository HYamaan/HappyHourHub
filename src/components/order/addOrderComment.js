import React, {useState} from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Title from "../UI/Title";

import PacmanLoader from "react-spinners/PacmanLoader";
import axios from "axios";
import {toast} from "react-toastify";


const addOrderComment=({setIsProductModal,userId})=>{

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isloading,setIsLoading]=useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [comment, setComment] = useState("");

    console.log(userId)
    const handleCrate= async ()=>{
        try {
            setIsProductModal(false);
            const newComment={
                userId:userId._id,
                fullName:userId.fullName,
                image:userId.image,
                comment:comment,
            }
            setIsLoading(true);
            const res=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comments`,newComment);
            if(res.status===201){
                setIsLoading(false);
                toast.success("Your comment has been posted."+"\n"+"Thank you.");
            }else{
                throw new Error();
            }
        }catch (err){
            console.log(err);
        }
    }

    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen z-40
            after:w-screen after:h-screen after:bg-white after:absolute after:top-0 after:left-0 after:opacity-60 grid place-content-center">
            {!isloading ?
                (  <OutsideClickHandler onOutsideClick={() => setIsProductModal(false)}>
                    <div className="w-full h-full grid place-content-center relative">
                        <div className="relative z-50 md:w-[600px] w-[570px]  bg-white border-2 p-10 rounded-3xl">
                            <Title className="text-[40px] text-center">Add a New Comment</Title>

                            <div className="flex flex-col text-sm my-4">
                                <span className="font-semibold mb-2 capitalize">write a review about the company</span>
                                <textarea
                                    rows="8"
                                    className="border-2 p-1 text-sm px-1 outline-none"
                                    placeholder="Write a description..."
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>


                            <div className="flex justify-end">
                                <button className="btn-primary  "
                                        onClick={handleCrate}>Create
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
export default addOrderComment;