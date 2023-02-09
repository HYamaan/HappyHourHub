import React from "react";
import Image from "next/image";
import {FaShoppingCart} from "react-icons/fa"

const MenuItem = ()=>{
    return <React.Fragment>
        <div className="rounded-3xl bg-secondary">
            <div className="w-full bg-tertiary h-[215px] grid place-content-center
                    rounded-bl-[46px] rounded-tl-2xl rounded-tr-2xl peer-hover:scale-120  ">
                <div className="relative w-36 h-36 sm:hover:scale-110 transition-all">
                    <Image src="/images/f1.png" alt="" fill style={{objectFit:"cover"}} sizes="w-full h-full"/>
                </div>
            </div>
            <div className=" text-[#ffff] p-[25px]">
                <div className="text-left">
                    <h3 className="text-lg font-semibold">Delicious Pizza</h3>
                    <div className="text-[15px] mt-2">
                        Veniam debitis quaerat officiis quasi cupiditate quo,
                        quisquam velit, magnam voluptatem repellendus sed eaque
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div>$20</div>
                    <button className="btn-primary !w-10 !h-10 rounded-full !p-0 grid place-content-center">
                        <FaShoppingCart/>
                    </button>
                </div>
            </div>
        </div>
    </React.Fragment>
}
export default MenuItem;