import React from "react";
import Image from "next/image"
import Slider from "react-slick"
import Title from "./UI/Title";
import Button from "./UI/Button"

const Carousel = () => {
    const settings = {
        dots: true,
        infinite: true,

        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5306660,
        appendDots: dots => (
            <div
                style={{
                    color: "yellow",
                    padding: "10px",
                }}
            >
                <ul style={{marginTop: "10px" }}> {dots} </ul>
            </div>
        ),
        customPaging: i => (
            <div className="w-3 h-3 border bg-white rounded-full top-[8rem] relative m-[300px]"></div>
        )


    };

    return (<div className="h-screen container mx-auto -mt-[88px]">
        <div className="absolute top-0 left-0 w-full h-full">
            <Image src="/images/hero-bg.jpg" alt="" fill style={{objectFit:"cover"}} sizes="w-full h-full"/>
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
                    <Button>Order Now</Button>
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
                <button className="btn-primary mt-[10px] !py-[10px] !px-[45px] ">Order Now</button>
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
                <button className="btn-primary mt-[10px] !py-[10px] !px-[45px] ">Order Now</button>
            </div>
        </div>
        </Slider>
    </div>)
}
export default Carousel;
