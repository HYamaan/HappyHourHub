import React, {useEffect, useState} from "react";
import Title from "../UI/Title";
import axios from "axios";

import Image from "next/image";
import {toast} from "react-toastify";

import PacmanLoader from "react-spinners/PacmanLoader";



const Order = () => {

    const [comments, setComments] = useState([]);
    const [homePageComments, setHomePageComments] = useState([]);
    const [pageComments, setPageComments] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [addButtonItHasClicked,setAddButtonItHasClicked]=useState(false);
    useEffect(() => {
        const getUseComments = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments`);
                setComments(res.data.reverse());
                setAddButtonItHasClicked(false);
            } catch (err) {
                console.log(err);
            }
        }
        getUseComments();
    }, [addButtonItHasClicked]);

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
    },[addButtonItHasClicked]);

    const addCommentToAdminComment = async (commentId,userId) => {
        try {
            const newAdminComment={
                userCommentsTable:commentId,
                userId:userId
            }
           const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/adminComments`, newAdminComment);
            if(res.status===201){
                toast.success("The user comment has been successfully added to the homepage.");
            }


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
            //console.log(commentId);
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
           // console.log(commentId);
        } catch (err) {
            console.log(err);
        }
    }


    return <>
        <form className=" flex-1 lg:p-8 lg:mt-0 mt-5 ">
            {pageComments ? (<>
                <div className="flex justify-between mb-1">
                    <Title className="text-[40px]">Customer Comments</Title>
                    <div className="flex items-center justify-center">
                        <div className="btn-primary !px-3" onClick={()=>setPageComments(!pageComments)}> Home Page Comments</div>
                    </div>
                </div>
                <div className="overflow-y-auto h-[327px]">
                    {!isLoading ? (<div className="overflow-auto  max-h-[575px] w-full">
                        <table
                            className="w-full text-sm text-center text-gray-500  break-words w-full break-words">
                            <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                            <tr>
                                <th scope="col" className="py-3 px-6">Comment</th>
                                <th scope="col" className="py-3 px-6 ">UserId</th>
                                <th scope="col" className="py-3 px-6  ">User</th>
                                <th scope="col" className=" py-3 px-6 ">Comments</th>

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
                                                        className={`border-2 rounded-full px-[6px] py-[2px] mr-4 
                                                         ${homePageComments.every(item=>item._id === userComment._id) ? "cursor-pointer":"hidden"}`}
                                                        onClick={() => {
                                                            setAddButtonItHasClicked(true);
                                                            addCommentToAdminComment(userComment._id,userComment.userId?._id);

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
                                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{userComment.userId?._id.slice(0, 10)}...</td>
                                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                        <Image
                                            src={userComment.userId.image}
                                            alt={userComment.userId.image}
                                            width={30}
                                            height={30}
                                            priority={true}
                                            className="w-auto h-auto"
                                        /> <span className="ml-2">{userComment.userId.fullName}</span>
                                    </td>
                                    <td className="py-4 px-6 font-medium  hover:text-white text-left">{userComment.comment}</td>
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
                </>)
            :
                 (   <>
                        <div className="flex justify-between mb-1">
                            <Title className="text-[40px]">Home Page Customer Comment</Title>
                            <div className="flex items-center justify-center">
                                <div className="btn-primary !px-3" onClick={()=>setPageComments(!pageComments)}> Customer Page Comments</div>
                            </div>
                        </div>
                        <div className="overflow-y-auto h-[327px]">
                            {
                                !isLoading ? (<div className="overflow-auto w-full h-max-[575px]  table-fixed break-words">
                                <table className="w-full text-sm text-center text-gray-500 w-full">
                                    <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                                    <tr>
                                        <th scope="col" className="py-3 px-6 ">Comment</th>
                                        <th scope="col" className="py-3 px-6 ">UserId</th>
                                        <th scope="col" className="py-3 px-6  ">User</th>
                                        <th scope="col" className=" py-3 px-6 ">Comments</th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                    {homePageComments?.length > 0 && homePageComments?.reverse()?.map((userComment) => (


                                        <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all"
                                            key={userComment._id}
                                        >
                                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">

                                                <span className="cursor-pointer hover:text-danger"
                                                      onClick={() => {
                                                          removeToAdminComment(userComment._id)
                                                      }}
                                                >
                                                        <i className="fa-solid fa-trash text-lg"></i>
                                                    </span>
                                            </td>
                                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{userComment.userId._id.slice(0, 10)}...</td>
                                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                                <Image
                                                    src={userComment.userId.image}
                                                    alt={userComment.userId.image}
                                                    width={30}
                                                    height={30}
                                                    priority={true}
                                                    className="w-auto h-auto"
                                                /> <span className="ml-2">{userComment.userId.fullName}</span>
                                            </td>
                                            <td className="py-4 px-6 font-medium hover:text-white text-left ">{userComment.userCommentsTable.comment}</td>
                                        </tr>))}


                                    </tbody>
                                </table>
                            </div>
                                    )
                             :
                             (
                                <div className="flex justify-center items-center mt-3  h-[375px]">
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
                 </>)
            }

        </form>

    </>
}
export default Order;