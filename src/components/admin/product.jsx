import React from "react";
import Image from "next/image";
import Title from "../UI/Title";
const Product =()=>{
    return <>
    <div>
        <div className=" flex-1 lg:p-8 lg:mt-0 mt-5">
            <Title className="text-[40px]">Account Settings</Title>
            <div className="overflow-x-auto w-full ">
                <table className="w-full h-full text-sm text-center text-gray-500 min-w-[1200px]">
                    <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                    <tr>
                        <th scope="col" className="py-3 px-6 uppercase">Image</th>
                        <th scope="col" className="py-3 px-6 uppercase">id</th>
                        <th scope="col" className="py-3 px-6 uppercase">title</th>
                        <th scope="col" className="py-3 px-6 uppercase">price</th>
                        <th scope="col" className="py-3 px-6 uppercase">action</th>
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

                            /> </td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white"><span>mayonez,acı sos, ketçap</span></td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white"><span>Good Pizza</span></td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">$20</td>
                        <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white"><button className="btn-primary !bg-[#FF0000]">Delete</button></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
}
export default Product;