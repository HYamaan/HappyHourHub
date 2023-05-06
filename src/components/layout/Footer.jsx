import React, {useEffect, useState} from "react";
import Title from "../UI/Title";

import {HiLocationMarker} from "react-icons/hi"
import {FaPhoneAlt} from "react-icons/fa"
import {MdLocalPostOffice} from "react-icons/md"
import axios from "axios";

const Footer = () => {
    const [footerInfo,setFooterInfo] = useState({});

    useEffect(()=>{
        const getFooterInfo=async ()=>{
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/footer`);
                    setFooterInfo(response.data[0]);
                }catch (err){
                    console.log(err);
                }
        }
        getFooterInfo();
    },[]);


    return <React.Fragment>
        <div className="bg-secondary pt-[75px] pb-[40px] text-center text-tertiary">
            <div className="container mx-auto flex flex-col md:gap-y-16 gap-y-4">
                <div className="grid md:gap-4 gap-y-10 md:grid-cols-3 grid-cols-1 grid-rows-1">
                    <div>
                        <Title className="text-[28px] text-center leading-8 mb-6">Contact Us</Title>
                        <div className="flex items-center flex-col gap-y-2.5">
                            <a href={`${footerInfo?.location}`} target="_blank" rel="noreferrer"
                                className="flex justify-center items-center gap-x-2 hover:text-primary gap-y-2"
                            >
                                <HiLocationMarker/> Location
                            </a>

                            <a href={`tel:${footerInfo?.phoneNumber}`}
                                className="flex justify-center items-center gap-x-2 hover:text-primary gap-y-2">
                                <FaPhoneAlt/> Call +90 ${footerInfo?.phoneNumber}
                            </a>
                            <a href={`mailto:${footerInfo?.email}`}
                                className="flex justify-center items-center gap-x-2 hover:text-primary gap-y-2">
                                <MdLocalPostOffice/> demo@gmail.com
                            </a>
                        </div>
                    </div>
                    <div>
                        <Title className="text-[38px] text-center mb-6 leading-8">Happy Hour Hub</Title>
                        <div className="my-5">
                            {footerInfo?.desc}
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-x-1 ">
                            {footerInfo?.socialMedia?.map((item)=>(
                                <a  href= {item?.link} target="_blank" rel="noopener noreferrer" key={item._id}
                                    className="flex justify-center items-center p-1.5 bg-tertiary text-secondary rounded-full md:hover:text-primary ">
                                    <i className={item?.icon}></i>
                                </a>
                            ))}


                        </div>
                    </div>
                    <div>
                        <Title className="text-[28px] text-center mb-6 leading-8">Opening Hours</Title>
                        <div className="font-sans mb-4 text-center">{footerInfo?.openingHours?.day}</div>
                        <div className="font-sans mb-4 text-center">{footerInfo?.openingHours?.hour}</div>
                    </div>
                </div>
                <div>&copy;2023 All Rights Reserved by <a href="https://github.com/HYamaan"
                                                          className="text-primary" target="_blank"
                                                          rel="noreferrer noopener"
                >HYamaan
                </a></div>
            </div>
        </div>
    </React.Fragment>
}
export default Footer;