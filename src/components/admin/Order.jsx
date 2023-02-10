import React from "react";
import Image from "next/image";
import Title from "../UI/Title";
const Product =()=>{
    return <>
            <div className=" flex-1 lg:p-8 lg:mt-0 mt-5">
                <Title className="text-[40px]">Account Settings</Title>
                <div className=" max-h-60 overflow-y-auto">
                    <div className="overflow-x-auto w-full mt-5 ">
                        <table className="w-full h-full text-sm text-center text-gray-500 min-w-[1000px] min-w-[1000px]">
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
                            <tr className="transition-all bg-secondary border-gray-700 hover:bg-primary ">
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white gap-x-1 ">
                                    63107...
                                </td>
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                    Hakan Yaman
                                </td>
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                    $12
                                </td>

                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                    Cash
                                </td>
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                    preparing
                                </td>
                                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                                    <button className="btn-primary !bg-success">Next Stage</button>
                                </td>
                            </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </>
}
export default Product;