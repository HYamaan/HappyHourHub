import React from "react";
import Image from "next/image"
import Slider from "react-slick"
import Title from "./UI/Title";
import {useRouter} from "next/router";

const Carousel = () => {
    const router=useRouter()
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000,
        appendDots: dots => (
            <div
                style={{
                    color: "yellow",
                    padding: "10px",
                }}
            >
                <ul > {dots} </ul>
            </div>
        ),
        customPaging: i => (
            <div className="w-3 h-3 border bg-white rounded-full top-[8rem] relative m-[300px]"></div>
        )




    };
    const sendMenu =async ()=>{
        try {
            router.push('/menu')
        }catch (err){
            console.log(err);
        }
    }

    return (<div className="h-screen container mx-auto -mt-[88px]">
        <div className="absolute top-0 left-0 w-full h-full">
            <Image src="/images/hero-bg.jpg" alt="hero-bg.png" priority={true} fill style={{objectFit:"cover"}} sizes="w-full h-full"/>
        </div>

        <Slider {...settings}>
            <div>
                <div className=" container mt-[13.688rem] text-white flex flex-col justify-center items-start z-index max-w-[34.688rem]
            ">
                    <Title className="mb-[15px] sm:text-[3.5rem] text-[1.8rem]">Fast Food Restaurant</Title>
                    <p className="mb-[16px] text-sm text-left leading-[21px]  ">
                        Doloremque, itaque aperiam facilis
                        rerum, commodi, temporibus sapiente ad mollitia laborum quam
                        quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos
                        nihil
                        ducimus libero ipsam.</p>
                    <button className="z-20 btn-primary cursor-pointer  md:mb-10 mb-0" onClick={()=>sendMenu()}>Order Now</button>
                </div>
            </div>
            <div>
            <div className=" mt-[13.688rem] text-white flex flex-col justify-center items-start z-index max-w-[34.688rem]
            ">
                <Title className="mb-[15px] sm:text-[3.5rem] ">Fast Food Restaurant</Title>
                <p className="mb-[16px] text-sm text-left leading-[21px]  ">
                    Doloremque, itaque aperiam facilis
                    rerum, commodi, temporibus sapiente ad mollitia laborum quam
                    quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos
                    nihil
                    ducimus libero ipsam.</p>
                <button className="z-40 btn-primary cursor-pointermd:mb-10 mb-0" onClick={()=>sendMenu()}>Order Now</button>
            </div>
        </div>
            <div>
            <div className=" mt-[13.688rem] text-white flex flex-col justify-center items-start z-index max-w-[34.688rem]
            ">
                <Title className="mb-[15px] sm:text-[3.5rem] ">Fast Food Restaurant</Title>
                <p className="mb-[16px] text-sm text-left leading-[21px]  ">
                    Doloremque, itaque aperiam facilis
                    rerum, commodi, temporibus sapiente ad mollitia laborum quam
                    quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos
                    nihil
                    ducimus libero ipsam.</p>
                <button className="z-20 btn-primary cursor-pointer  md:mb-10 mb-0" onClick={()=>sendMenu()}>Order Now</button>
            </div>
        </div>
        </Slider>
    </div>)
}
export default Carousel;
