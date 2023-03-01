import React, {useEffect, useState} from "react";

import Title from "../UI/Title";
import axios from "axios";
const Order =()=>{
    const [orders,setOrders]=useState([]);
    const status = ["Preparing","On the way","Delivered"];

    useEffect(()=>{
        const getOrders= async ()=>{
            try {
                const order = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
                setOrders(order.data);

            }catch (err){
                console.log(err);
            }
        }
        getOrders();
    },[]);


    const handleStatus = async (id)=>{
        console.log("id",id)
        const item = orders.find((item)=>item._id === id);
        const currentStatus = item.status;
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,{
                status:item.status < status.length-1 ? item.status +=1 : item.status,
            });
            setOrders([res.data,...orders.filter((order)=>order._id !== id)]);

        }catch (err){
            console.log(err);
        }
    }
    return <>
            <div className=" flex-1 lg:p-8 lg:mt-0 mt-5">
                <Title className="text-[40px]">Account Settings</Title>
                <div className=" max-h-[267px] overflow-y-auto">
                    <div className="overflow-x-auto w-full mt-5 ">
                        <table className="w-full h-full text-sm text-center text-gray-500 min-w-[1000px] m]">
                            <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                            <tr>
                                <th scope="col" className="py-3 px-6 uppercase">PRODUCT ID</th>
                                <th scope="col" className="py-3 px-6 uppercase">CUSTOMER</th>
                                <th scope="col" className="py-3 px-6 uppercase">TOTAL</th>
                                <th scope="col" className="py-3 px-6 uppercase">PAYMENT</th>
                                <th scope="col" className="py-3 px-6 uppercase">STATUS</th>
                                <th scope="col" className="py-3 px-6 uppercase">ACTION</th>
                            </tr>
                            </thead>
                            <tbody>
                            { orders.length > 0 && orders.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map((order)=>(
                                <tr className="transition-all bg-secondary border-gray-700 hover:bg-primary " key={order._id}>
                                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white gap-x-1 ">
                                        {order?._id.substring(0,5)}...
                                    </td>
                                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                        {order?.fullName}
                                    </td>
                                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                        ${order?.total}
                                    </td>

                                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                        {order?.method === 0 ?"Cash" : "Cart"}
                                    </td>
                                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                        {status[order?.status]}
                                    </td>
                                    <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                        <button className="btn-primary !bg-success "
                                                disabled={order?.status > status.length-2}
                                                onClick={()=>handleStatus(order?._id)}>Next Stage</button>
                                    </td>
                                </tr>
                            ))}


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </>
}
export default Order;