import React from "react";
import Title from "../UI/Title";

import {HiLocationMarker} from "react-icons/hi"
import {FaPhoneAlt, FaFacebookF} from "react-icons/fa"
import {GrLinkedinOption} from "react-icons/gr"
import {MdLocalPostOffice} from "react-icons/md"
import {BsTwitter, BsInstagram, BsPinterest} from "react-icons/bs"

const Footer = () => {
    return <React.Fragment>
        <div className="bg-secondary pt-[75px] pb-[40px] text-center text-tertiary">
            <div className="container mx-auto flex flex-col md:gap-y-16 gap-y-4">
                <div className="grid md:gap-4 gap-y-10 md:grid-cols-3 grid-cols-1 grid-rows-1">
                    <div>
                        <Title className="text-[28px] text-center leading-8 mb-6">Contact Us</Title>
                        <div className="flex items-center flex-col gap-y-2.5">
                            <div className="flex justify-center items-center gap-x-2 hover:text-primary gap-y-2">
                                <HiLocationMarker/> Location
                            </div>
                            <div className="flex justify-center items-center gap-x-2 hover:text-primary gap-y-2">
                                <FaPhoneAlt/> Call +01 1234567890
                            </div>
                            <div className="flex justify-center items-center gap-x-2 hover:text-primary gap-y-2">
                                <MdLocalPostOffice/> demo@gmail.com
                            </div>
                        </div>
                    </div>
                    <div>
                        <Title className="text-[38px] text-center mb-6 leading-8">Feane</Title>
                        <div className="my-5">
                            Necessary, making this the first true generator on the Internet. It uses a dictionary of
                            over 200 Latin words, combined with
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-x-1 ">
                            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
                               className="flex justify-center items-center p-1.5 bg-tertiary text-secondary rounded-full md:hover:text-primary ">
                                <FaFacebookF/>
                            </a>
                            <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer"
                               className="flex justify-center items-center p-1.5 bg-tertiary text-secondary rounded-full md:hover:text-primary ">
                                <BsTwitter/>
                            </a>
                            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"
                               className="flex justify-center items-center p-1.5 bg-tertiary text-secondary rounded-full md:hover:text-primary ">
                                <GrLinkedinOption/>
                            </a>
                            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
                               className="flex justify-center items-center p-1.5 bg-tertiary text-secondary rounded-full md:hover:text-primary ">
                                <BsInstagram/>
                            </a>
                            <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer"
                               className="flex justify-center items-center p-1.5 bg-tertiary text-secondary rounded-full md:hover:text-primary ">
                                <BsPinterest/>
                            </a>

                        </div>
                    </div>
                    <div>
                        <Title className="text-[28px] text-center mb-6 leading-8">Opening Hours</Title>
                        <div className="font-sans mb-4 text-center">Everyday</div>
                        <div className="font-sans mb-4 text-center">10.00 Am -10.00 Pm</div>
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