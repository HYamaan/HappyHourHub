import React, {useEffect, useState} from "react";
import Title from "../UI/Title";
import CustomerItem from "./CustomerItem";
import {IoIosArrowForward,IoIosArrowBack} from "react-icons/io"

import Slider from "react-slick";
import axios from "axios";
import {usePathname} from "next/navigation";

const Customers = () => {
    const [customerComment,setCustomerComments]=useState([]);
    const pathname = usePathname();
    //console.log("pathname",pathname);
    useEffect(()=>{
        const getUserComments=async ()=>{
            try {
                const userComment=await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/adminComments`);
                setCustomerComments(userComment.data);

            }catch (err){
                console.log(err);
            }
        }
        getUserComments();
    },[pathname]);
    //console.log(customerComment);


    const NextBtn=({onClick})=>{
        return(
            <button className="absolute bg-primary text-2xl -bottom-12 left-1/2 flex items-center justify-center w-10 h-10 rounded-full text-white ml-1.5" onClick={onClick}>
                <IoIosArrowForward/>
            </button>
        );
    }
    const PrevBtn=({onClick})=>{
        return(
            <button className="absolute bg-primary text-2xl -bottom-12 right-1/2 flex items-center justify-center w-10 h-10 rounded-full text-white mr-1.5" onClick={onClick}>
                <IoIosArrowBack/>
            </button>
        );
    }
    const settings = {
        dots: false,
        infinite: false,
        speed: 1000,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay:true,
        autoplaySpeed:1000,
        arrows:true,
        nextArrow:<NextBtn/>,
        prevArrow:<PrevBtn/>,
        responsive:[
            {
                breakpoint: 768,
                settings:{
                    slidesToShow: 1,
                    arrows: false,
                }
            }
        ]
    };
    return <React.Fragment>
        <div className="container mx-auto mb-20 mt-14">
            <div>
                <Title className="text-[40px] text-center">What Says Our Customers</Title>
            </div>

                <Slider {...settings}>
                    {customerComment?.map((item)=>(<CustomerItem key={item._id} item={item}/>))}

                </Slider>

        </div>

    </React.Fragment>
}
export default Customers;


