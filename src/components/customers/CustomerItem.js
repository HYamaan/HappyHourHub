import React from "react";
import Image from "next/image"

const CustomerItem = (props) => {
    return <React.Fragment>
        <div className="flex flex-col mx-4">
            <div className="p-6 bg-secondary text-tertiary text-left text-[15px] rounded-[5px] font-sans mt-[45px]">
                <p className=" mb-[10px]">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Accusantium consequuntur eius natus.Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Accusantium consequuntur eius natus.
                </p>
                <div className="flex flex-col mt-4">
                    <h6 className="text-[17px] font-bold">Moana Michell</h6>
                    <span className="text-[15px]">magna aliqua</span>
                </div>
            </div>
            <div className="relative w-28 h-28 mt-[26px] border-4 border-primary rounded-full
                before:content[''] before:w-5 before:h-5 before:absolute before:-top-2.5 before:left-1/2 before:-translate-x-2.5
                 before:bg-primary before:-rotate-45 before:transform
                 flex justify-center" >
                <Image
                    src={props.imgSrc}
                    fill
                    alt="client1"
                    style={{objectFit:"contain"}}
                    className="rounded-full"
                />
            </div>
        </div>


    </React.Fragment>
}
export default CustomerItem;



