import React from "react";
import Image from "next/image";
import Title from "../UI/Title";


const Order = () => {
    return(
        <form className=" flex-1 lg:p-8 lg:mt-0 mt-5">
            <Title className="text-[40px]">Account Settings</Title>
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-center text-gray-500 min-w-[1000px] ">
                    <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                    <tr>
                        <th scope="col" className="py-3 px-6">ID</th>
                        <th scope="col" className="py-3 px-6">ADRESS</th>
                        <th scope="col" className="py-3 px-6">DATE</th>
                        <th scope="col" className="py-3 px-6">TOTAL</th>
                        <th scope="col" className="py-3 px-6">STATUS</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className=" border-b border-gray-700 bg-secondary
                    hover:bg-primary hover:border-primary transition-all">
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center justify-center gap-x-2">
                            <Image
                                src="/images/f1.png"
                                alt="f1.png"
                                width={50}
                                height={50}

                            /> <span>Good Pizza</span></td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white"><span>mayonez,acı sos, ketçap</span></td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">$20</td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">1</td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">preparing</td>

                    </tr>


                    </tbody>
                </table>
            </div>
        </form>
    );
}
export default Order;