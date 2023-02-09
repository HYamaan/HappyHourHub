import React from "react";
import Image from "next/image";
import {FaShoppingCart} from "react-icons/fa"
import Title from "./UI/Title";


const CampaignItem = () => {
    return <div className="bg-secondary flex flex-1
                            items-center gap-x-4
                            rounded py-5 px-[0.938rem]">

        <div className="relative md:w-44 md:h-44 w-36 h-36
        after:content-[''] border-[5px]
        border-primary rounded-full  overflow-hidden"
        >
            <Image
                src="/images/o1.jpg"
                alt="o1.jpg"
                fill
                sizes="w-full h-full"
                style={{objectFit:"cover"}}
                className="sm:hover:scale-105 sm:transition-all w-full h-auto"/>
        </div>
        <div className="text-white">
            <Title className="text-2xl">Tasty Thursdays</Title>
            <div className="font-dancing font-bold my-2">
                <span className="text-[2.5rem] ">20%</span>
                <span className="text-md inline-block ml-[1px]">Off</span>
            </div>
            <button className="btn-primary flex items-center gap-x-2">
                Order Now <FaShoppingCart className="text-lg"/>
            </button>
        </div>
    </div>
}

const Campaigns = () => {
    return <React.Fragment>
        <div className="flex container mx-auto flex-wrap
                        pt-[2.813rem] pb-[5.625rem]
                        text-left leading-[1.5rem]
                        gap-6
         ">
            <CampaignItem/>
            <CampaignItem/>
        </div>
    </React.Fragment>
}
export default Campaigns;