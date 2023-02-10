import React from "react";
import Image from "next/image";
import Title from "../../components/UI/Title";

const Cart = () => {
    return <div  className="min-h-[calc(100vh_-_433px)]">
        <div className="flex justify-between items-center md:flex-row flex-col">
            <div className="md:min-h-[calc(100vh_-_433px)] flex items-center flex-1 p-10 overflow-x-auto w-full">
                <table className="w-full text-sm text-center text-gray-500 min-w-[2000px] ">
                    <thead className="text-xs bg-gray-700 text-gray-400 uppercase">
                    <tr>
                        <th scope="col" className="py-3 px-6">PRODUCT</th>
                        <th scope="col" className="py-3 px-6">EXTRAS</th>
                        <th scope="col" className="py-3 px-6">PRICE</th>
                        <th scope="col" className="py-3 px-6">QUANTITY</th>
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
                    </tr>
                    <tr className= "border-b border-gray-700 bg-secondary
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
                    </tr>
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
                    </tr>




                    </tbody>
                </table>
            </div>
            <div className="bg-secondary min-h-[calc(100vh_-_433px)] flex flex-col
             justify-center text-white p-12 md:w-auto w-full   md:text-start !text-center">
                <Title className="text-[40px] md:mt-0 mt-10 ">CART TOTAL</Title>
                <div className="text-sm font-sans self-start text-left">
                    <div><span className="font-bold">Subtotal:</span>$20</div>
                    <div><span className="font-bold">Discount:</span>$0.00</div>
                    <div><span className="font-bold">Total:</span>$20</div>
                </div>
                <button className="btn-primary mt-4 md:w-auto w-52 text-center self-center">CHECKOUT NOW!</button>
            </div>
        </div>
    </div>
}
export default Cart;