import React, {useEffect, useState} from "react";
import Title from "../UI/Title";
import axios from "axios";

import Image from "next/image";
import {toast} from "react-toastify";

import PacmanLoader from "react-spinners/PacmanLoader";



const Order = () => {

    const [comments, setComments] = useState([]);
    const [homePageComments, setHomePageComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const getUseComments = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments`);
                setComments(res.data.reverse());
            } catch (err) {
                console.log(err);
            }
        }
        getUseComments();
    }, []);

    useEffect(() => {
        const getAdminPageComments = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/adminComments`);
                setHomePageComments(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getAdminPageComments();
    });


    const addCommentToAdminComment = async (commentId) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId.toString()}`);
            const {comment: comment, fullName: fullName, image: image, userId: userId} = res.data;
            const transferComments = {comment, fullName, image, userId};
             await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/adminComments`, transferComments);

        } catch (err) {
            console.log(err);
        }
    }
    const removeToUserComment = async (commentId) => {
        try {
            const deleteComment = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`);
            if (deleteComment.status === 200) {
                toast.success("User comment deleted.");
                setComments((prev) => prev.filter((item) => item._id !== commentId));
            }
            console.log(commentId);
        } catch (err) {
            console.log(err);
        }
    }
    const removeToAdminComment = async (commentId) => {
        try {
            const deleteComment = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/adminComments/${commentId}`);
            if (deleteComment.status === 200) {
                toast.success("User comment removed from homepage.");
                setHomePageComments((prev) => prev.filter((item) => item._id !== commentId));
            }
            console.log(commentId);
        } catch (err) {
            console.log(err);
        }
    }


    return <>
        <form className=" flex-1 lg:p-8 lg:mt-0 mt-5 ">
            <Title className="text-[40px]">Account Settings</Title>
            <div className="overflow-y-auto h-[275px]">
                {!isLoading ? (<div className="overflow-auto  max-h-[575px] w-full">
                    <table
                        className="w-full text-sm text-center text-gray-500  break-words  w-full break-words">
                        <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                        <tr>
                            <th scope="col" className="py-3 px-6">Comment</th>
                            <th scope="col" className="py-3 px-6 ">UserId</th>
                            <th scope="col" className="py-3 px-6  ">User</th>
                            <th scope="col" className=" py-3 px-8  ">Comments</th>

                        </tr>
                        </thead>
                        <tbody>
                        {comments?.length > 0 && comments?.map((userComment) => (


                            <tr className=" border-b border-gray-700 bg-secondary
                                                    hover:bg-primary hover:border-primary transition-all"
                                key={userComment._id}
                            >
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                                    <span
                                                        className="border-2 rounded-full px-[6px] py-[2px] mr-4 cursor-pointer"
                                                        onClick={() => {
                                                            addCommentToAdminComment(userComment._id)
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-plus"></i>
                                                    </span>
                                    <span className="cursor-pointer hover:text-danger"
                                          onClick={() => {
                                              removeToUserComment(userComment._id)
                                          }}
                                    >
                                                        <i className="fa-solid fa-trash text-lg"></i>
                                                    </span>
                                </td>
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{userComment.userId.slice(0, 10)}...</td>
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                    <Image
                                        src={userComment.image}
                                        alt={userComment.image}
                                        width={30}
                                        height={30}
                                        priority={true}
                                        className="w-auto h-auto"
                                    /> <span className="ml-2">{userComment.fullName}</span>
                                </td>
                                <td className="py-4 px-6 font-medium  hover:text-white">{userComment.comment}</td>
                            </tr>))}


                        </tbody>
                    </table>
                </div>) : (<div className="flex justify-center items-center mt-3  h-[275px]">
                    <PacmanLoader
                        color="#fff200"
                        cssOverride={{}}
                        loading
                        margin={2}
                        size={46}
                        speedMultiplier={1}
                    />
                </div>)}


            </div>
            <Title className="text-[20px] mt-2">Home Page Customer Comment</Title>
            <div className="overflow-y-auto h-[275px]">
                {!isLoading ? (<div className="overflow-auto w-full h-max-[575px]  table-fixed break-words">
                    <table className="w-full text-sm text-center text-gray-500 w-full">
                        <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                        <tr>
                            <th scope="col" className="py-3 px-6 ">Comment</th>
                            <th scope="col" className="py-3 px-6 ">UserId</th>
                            <th scope="col" className="py-3 px-6  ">User</th>
                            <th scope="col" className=" py-3 px-8 text-left ml-10">Comments</th>

                        </tr>
                        </thead>
                        <tbody>
                        {homePageComments?.length > 0 && homePageComments?.reverse()?.map((userComment) => (


                            <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all"
                                key={userComment._id}
                            >
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                                    <span
                                                        className="border-2 rounded-full px-[6px] py-[2px] mr-4 cursor-pointer"
                                                        onClick={() => {
                                                            addCommentToAdminComment(userComment._id)
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-plus"></i>
                                                    </span>
                                    <span className="cursor-pointer hover:text-danger"
                                          onClick={() => {
                                              removeToAdminComment(userComment._id)
                                          }}
                                    >
                                                        <i className="fa-solid fa-trash text-lg"></i>
                                                    </span>
                                </td>
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{userComment._id.slice(0, 10)}...</td>
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                    <Image
                                        src={userComment.image}
                                        alt={userComment.image}
                                        width={30}
                                        height={30}
                                        priority={true}
                                        className="w-auto h-auto"
                                    /> <span className="ml-2">{userComment.fullName}</span>
                                </td>
                                <td className="py-4 px-6 font-medium hover:text-white text-left ">{userComment.comment}</td>
                            </tr>))}


                        </tbody>
                    </table>
                </div>) : (<div className="flex justify-center items-center mt-3  h-[375px]">
                    <PacmanLoader
                        color="#fff200"
                        cssOverride={{}}
                        loading
                        margin={2}
                        size={46}
                        speedMultiplier={1}
                    />
                </div>)}


            </div>
        </form>

    </>
}
export default Order;