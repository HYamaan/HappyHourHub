import React from "react";
import Image from "next/image";
import axios from "axios";


const Order = ({order}) => {
    const status = order?.status;
    const statusClass = (index) => {
        if (index - status < 1) return "";
        if (index - status === 1) return "animate-pulse";
        if (index - status > 1) return "";
    }

    return <div className="overflow-x-auto">
        <div className="min-h-[calc(100vh_-_433px)] flex justify-between items-center  flex-col   min-w-[1000px]">
            <div className=" flex items-center flex-col gap-y-10
             flex-1 p-10 w-full">
                <table className="w-full text-sm text-center text-gray-500 w-full">
                    <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                    <tr>
                        <th scope="col" className="py-3 px-6">ORDER ID</th>
                        <th scope="col" className="py-3 px-6">CUSTOMER</th>
                        <th scope="col" className="py-3 px-6">ADDRESS</th>
                        <th scope="col" className="py-3 px-6">TOTAL</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all" key={order._id}>
                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                                {order._id.substring(0, 5)}...
                            </td>
                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{order?.customer}
                            </td>
                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">{order?.address}</td>
                            <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">${order?.total}</td>
                        </tr>
                    }

                    </tbody>
                </table>

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
                        <span>On the way </span>
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
