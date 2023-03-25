import React, {useEffect, useState} from "react";
import Image from "next/image";
import axios from "axios";
import {useRouter} from "next/router";
import AddOrderComment from "../../components/order/addOrderComment";
import {useSession} from "next-auth/react";




const Order = ({order}) => {
    const {data:session}=useSession();
    const[isProductModal,setIsProductModal]=useState(false);
    const status = order?.status;
    const statusProducts=["Payment","Preparing","On the way","Delivered"]
    const router =useRouter();
    const [userId,setUserId]=useState("");
    const [showProducts,setShowProducts]=useState(false);


    useEffect(()=>{
        const getUserId=async ()=>{
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
                setUserId(
                    res.data?.find((user) => user.email === order?.email)
                );


            }catch (err){
                console.log(err);
            }
        }
        getUserId();
    },[setUserId]);




    const statusClass = (index) => {
        if (index - status < 0) return "";
        if (index - status === 0) return "animate-pulse";
        if (index - status > 0) return "";
    }

    const showProductMenu=  (productId)=>{
        router.push(`/product/${productId.toString()}`);
        console.log("showProductMenu",productId)
    }

    return <div className="overflow-x-auto relative">
        <div className="w-full  my-2 mb-4"> <span className="absolute left-10">
            <button className="btn-primary" onClick={()=>setIsProductModal(true)}>Comment</button>
        </span> </div>

        {isProductModal && <AddOrderComment setIsProductModal={setIsProductModal} userId={userId}/>}

        <div className=" min-h-[calc(100vh_-_433px)] flex justify-between items-center  flex-col   min-w-[1000px]">
            <div className={`flex items-center flex-col gap-y-10 flex-1 p-10 w-full`}>
                <table className={`w-full text-sm text-center text-gray-500 w-full ${!showProducts && "mb-[410px]"}`}>
                    <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                    <tr>
                        <th scope="col" className="py-3 px-6">ORDER ID</th>
                        <th scope="col" className="py-3 px-6">CUSTOMER</th>
                        <th scope="col" className="py-3 px-6">ADDRESS</th>
                        <th scope="col" className="py-3 px-6">TOTAL</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">

                    {
                        <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all" key={order._id} onClick={()=>{setShowProducts(!showProducts)}}>
                            <td className="py-4 px-2 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                <i className="fa-solid fa-arrow-down mr-6"></i>
                                {order._id.substring(0, 5)}...
                            </td>
                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{order?.customer}
                            </td>
                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{order?.address}</td>
                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">${order?.total}</td>
                        </tr>
                    }</tbody>
                </table>
                {
                    ( showProducts && (
                            <div className="overflow-auto w-full h-[370px] lg:mx-0 mx">
                                <table className="w-full text-sm text-center text-gray-500  cursor-pointer">
                                    <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">PRODUCT</th>
                                        <th scope="col" className="py-3 px-6">EXTRAS</th>
                                        <th scope="col" className="py-3 px-6">PRICE</th>
                                        <th scope="col" className="py-3 px-6">QUANTITY</th>
                                        <th scope="col" className="py-3 px-6">STATUS</th>
                                    </tr>
                                    </thead>
                                    <tbody >
                                    {
                                        order?.productOrder?.length>0 &&
                                        order?.productOrder.map((orderProduct)=>(
                                            <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all group"
                                                key={Math.random()}
                                                onClick={()=>{showProductMenu(orderProduct.orderId)}}
                                            >
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                                    <Image
                                                        src={orderProduct.image}
                                                        alt={orderProduct.image}
                                                        width={30}
                                                        height={30}
                                                        priority={true}
                                                        className="w-auto h-auto"
                                                    /> <span>{orderProduct.title}</span>
                                                </td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                    <span>
                                        {
                                            orderProduct.extras?.length >0
                                                ?
                                                (orderProduct.extras.map(item=><span key={item._id}>{item.text}</span>))
                                                :
                                                ("Empty")
                                        }
                                    </span>
                                                </td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{orderProduct.price}</td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{orderProduct?.quantity}</td>
                                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                                       <span className="border-2 border-primary px-4 py-2 rounded-xl group-hover:border-tertiary">
                                                           {statusProducts[order.status]}
                                                       </span>
                                                </td>
                                            </tr>
                                        ))
                                    }


                                    </tbody>
                                </table>
                            </div>
                        )

                    )
                }

                <div className="flex justify-between w-full bg-primary p-5 w-full">
                    <div className={`relative flex flex-col items-center ${statusClass(0)}`} >
                        <Image src="/images/paid.png" alt="/images/paid.png"
                               className="w-auto h-auto" width={40} height={40}/>
                        <span>Payment</span>
                    </div>
                    <div className={`relative flex flex-col items-center ${statusClass(1)}`}>
                        <Image src="/images/bake.png" alt="/images/bake.png"
                               className="w-auto h-auto" width={40} height={40}/>
                        <span>Preparing</span>
                    </div>
                    <div className={`relative flex flex-col items-center ${statusClass(2)}`}>
                        <Image src="/images/bike.png" alt="/images/bike.png"
                               className="w-auto h-auto" width={40} height={40}/>
                        <span>On the way</span>
                    </div>
                    <div className={`relative flex flex-col items-center ${statusClass(3)}`}>
                        <Image src="/images/delivered.png" alt="/images/delivered.png" className="w-auto h-auto" width={40} height={40}/>
                        <span>Delivered</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
}
export const getServerSideProps = async ({params}) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`);
    return {
        props: {
            order: res.data ? res.data : [],
        }
    }
}
export default Order;
