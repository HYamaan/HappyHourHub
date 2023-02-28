import React from "react";
import Image from "next/image";
import {FaShoppingCart} from "react-icons/fa"
import Link from "next/link";

const MenuItem = (props)=>{
    return <React.Fragment>
        <div className="rounded-3xl bg-secondary">
            <div className="w-full bg-tertiary h-[215px] grid place-content-center
                    rounded-bl-[46px] rounded-tl-2xl rounded-tr-2xl peer-hover:scale-120  ">
                <Link href="/product">
                    <div className="relative w-36 h-36 sm:hover:scale-110 transition-all">
                        <Image src={props.image} alt="f1.png" fill style={{objectFit:"contain"}} sizes="w-full h-full" priority={true}/>
                    </div>
                </Link>
            </div>
            <div className=" text-[#ffff] p-[25px]">
                <div className="text-left">
                    <h3 className="text-lg font-semibold">{props.title}</h3>
                    <div className="text-[15px] mt-2">
                        {props.desc}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div>${props.prices[0]}</div>
                    <button className="btn-primary !w-10 !h-10 rounded-full !p-0 grid place-content-center">
                        <FaShoppingCart/>
                    </button>
                </div>
            </div>
        </div>
    </React.Fragment>
}
export default MenuItem;