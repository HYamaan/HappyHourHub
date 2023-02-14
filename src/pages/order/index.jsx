import React from "react";
import Image from "next/image";


const Order = () => {
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
                    <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all">
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                            6323c2ipsx
                        </td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">Hakan Yaman
                        </td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">İstanbul</td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">$20</td>
                    </tr>

                    </tbody>
                </table>

                <div className="flex justify-between w-full bg-primary p-5 w-full">
                    <div className="relative flex flex-col items-center animate-pulse"><Image src="/images/paid.png" alt="/images/paid.png" width={40} height={40}/><span>Payment</span></div>
                    <div className="relative flex flex-col items-center"><Image src="/images/bake.png" alt="/images/bake.png" width={40} height={40}/><span>Preparing</span></div>
                    <div className="relative flex flex-col items-center"><Image src="/images/bike.png" alt="/images/bike.png" width={40} height={40}/><span>On the way</span></div>
                    <div className="relative flex flex-col items-center"><Image src="/images/delivered.png" alt="/images/delivered.png" width={40} height={40}/><span>Delivered</span></div>
                </div>
            </div>
        </div>
    </div>
}
export default Order;
