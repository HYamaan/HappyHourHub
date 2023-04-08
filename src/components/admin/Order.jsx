import React, {useEffect, useState} from "react";

import Title from "../UI/Title";
import axios from "axios";
import Image from "next/image";
import {BiArrowBack} from "react-icons/bi";

const Order = () => {
    const [customerProduct, setCustomerProduct] = useState(true);
    const [customerOrderId,setCustomerOrderId]=useState("");
    const [orders, setOrders] = useState([]);
    const status = ["Preparing", "On the way", "Delivered"];

    useEffect(() => {
        const getOrders = async () => {
            try {
                const order = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
                setOrders(order.data);
                console.log("OrderPage", order.data)
            } catch (err) {
                console.log(err);
            }
        }
        getOrders();
    }, []);


    const handleStatus = async (id) => {
        //console.log("id",id)
        const item = orders.find((item) => item._id === id);
        const currentStatus = item.status;
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
                status: item.status < status.length - 1 ? item.status += 1 : item.status,
            });
            setOrders([res.data, ...orders.filter((order) => order._id !== id)]);

        } catch (err) {
            console.log(err);
        }
    }

    const showOrderProducts=(id)=>{
        const findOrder=orders.find((item)=>item._id===id);

        if(findOrder){
            setCustomerOrderId(findOrder);
            setCustomerProduct(false);
            console.log("customerOrderId",customerOrderId)
        }

    }

    return <>
        <div className=" flex-1 lg:p-8 lg:mt-0 mt-5">
            <div className="flex justify-between mb-1">
                <Title className="text-[40px]">Order Page</Title>
                {
                   !customerProduct &&
                    <div className="flex items-center justify-center">
                        <div className="btn-primary !px-3" onClick={()=>setCustomerProduct(!customerProduct)}>
                      <BiArrowBack />
                        </div>
                    </div>
                }
            </div>
            <div className="overflow-x-auto w-full mt-5 max-h-[267px]">
                {
                    customerProduct ?
                        (
                            <>
                                <table
                                    className="w-full text-sm text-center text-gray-500  break-words w-full break-words ">
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
                                    {orders.length > 0 && orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                                        <tr className="transition-all bg-secondary border-gray-700 hover:bg-primary "
                                            key={order._id}>
                                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white gap-x-1 "
                                            onClick={()=>showOrderProducts(order._id)}
                                            >
                                                <i className="fa-solid fa-arrow-down mr-6"></i>
                                                {order?._id.substring(0, 5)}...
                                            </td>
                                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                                {order?.customer}
                                            </td>
                                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                                ${order?.total}
                                            </td>

                                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                                {order?.method === 0 ? "Cash" : "Cart"}
                                            </td>
                                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                                {status[order?.status]}
                                            </td>
                                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                                <button className="btn-primary !bg-success "
                                                        disabled={order?.status > status.length - 2}
                                                        onClick={() => handleStatus(order?._id)}>Next Stage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </>
                        )
                        : (
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
                                        customerOrderId?.productOrder?.length>0 &&
                                        customerOrderId?.productOrder.map((orderProduct)=>(
                                            <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all group"
                                                key={orderProduct._id}
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
                                                           {status[customerOrderId.status]}
                                                       </span>
                                                </td>
                                            </tr>
                                        ))
                                    }


                                    </tbody>
                                </table>
                            </div>
                        )
                }
            </div>

        </div>
    </>
}
export default Order;