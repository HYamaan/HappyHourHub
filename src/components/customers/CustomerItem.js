import React from "react";
import Image from "next/image"

const CustomerItem = ({item}) => {
    return <React.Fragment>
        <div className="flex flex-col mx-4">
            <div className="p-6 bg-secondary text-tertiary text-left text-[15px] rounded-[5px] font-sans mt-[45px]">
                <p className=" mb-[10px] h-20">
                    {item.comment.charAt(0).toUpperCase() + item.comment.slice(1)}
                </p>
                <div className="flex flex-col mt-4">
                    <h6 className="text-[17px] font-bold">{item.fullName}</h6>
                </div>
            </div>
            <div className="relative w-28 h-28 mt-[26px] border-4 border-primary rounded-full
                before:content[''] before:w-0 before:h-0 before:absolute before:top-[-20px] before:border-l-[10px]  before:border-l-transparent
                before:border-r-[10px]  before:border-r-transparent  before:border-b-[20px]  before:border-b-primary
                 flex justify-center" >
                <Image
                    src={item.image}
                    fill
                    alt="client1"
                    style={{objectFit:"contain"}}
                    className="rounded-full"
                />
            </div>
        </div>
    {/*before:-top-2.5 before:left-1/2 before:-translate-x-2.5
                 before:bg-primary before:-rotate-45 before:transform*/}

    </React.Fragment>
}
export default CustomerItem;



