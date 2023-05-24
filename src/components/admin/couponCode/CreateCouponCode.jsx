import React, {useState} from "react";
import OutsideClickHandler from "react-outside-click-handler"

import PacmanLoader from "react-spinners/PacmanLoader";
import axios from "axios";
import {toast} from "react-toastify";
import Title from "../../UI/Title";



const CreateCouponCode=({products,setShowCreateCouponCode})=>{

    const [couponText,setCouponText]=useState("");
    const [dayText,setDayText]=useState("");
    const [giftPriceText,setGiftPriceText]=useState(0);
    const [productText,setProductText]=useState("");
    const [selectProductType,setSelectProductType]=useState(false);
    const [selectAmountType,setSelectAmountType]=useState(false);
    const [isLoading,setIsLoading]=useState(false);



    // console.log(userId)
    const handleCrate= async ()=>{
        if(selectProductType || setSelectAmountType ){
            try {
                const data = {
                    code:couponText.replace(/\s/g, ""),
                    date:dayText
                };
                if (selectProductType){
                    data.productId=productText.toString();
                }
                if(selectAmountType){
                    data.discountAmount=giftPriceText
                }
                console.log("data",data)

                const couponCodePost = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/couponCode/add-coupon-code`,data);
                console.log("KUPON KODU",couponCodePost.data)
                if(couponCodePost.status === 200){
                    setShowCreateCouponCode(false);
                }

            }catch (err){
                setShowCreateCouponCode(false);
                console.log(err);
            }
        }else{
            toast.warn("Lütfen fiyat değerini seçiniz")
        }
    }
   const handleChooseProductGift=(event)=>{
       setSelectProductType(event.target.checked);

    }
    const handleChooseAmountGift=(event)=>{
        setSelectAmountType(event.target.checked);
    }

    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen z-40
            after:w-screen after:h-screen after:bg-white after:absolute after:top-0 after:left-0 after:opacity-60 grid place-content-center">
            {!isLoading ?
                (  <OutsideClickHandler onOutsideClick={() => setShowCreateCouponCode(false)}>
                    <div className="w-full lg:h-96 grid place-content-center relative">
                        <div className="relative z-50 md:w-[500px] w-80 bg-white border-2 p-6 rounded-3xl overflow-y-auto no-scrollbar">
                            <Title className="lg:text-[40px] text-[28px] text-center">Create Coupon Code</Title>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col text-sm mt-4 w-52">
                                    <span className="font-semibold mb-[2px] ">Coupon</span>
                                    <input
                                        type="text"
                                        className="border-[1.11px] p-2 text-sm px-1 outline-none"
                                        placeholder="Kupon Kodu"
                                        onChange={(e) => setCouponText(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col text-sm mt-4 w-52">
                                    <span className="font-semibold mb-[2px] ">Kaç Gün Geçerli olmalı</span>
                                    <input
                                        type="Number"
                                        className="border-[1.11px] p-2 text-sm px-1 outline-none"
                                        placeholder="Gün Sayısı"
                                        min="1"
                                        onChange={(e) => setDayText(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-around mt-4">
                                <div className={`flex  items-start  ${selectProductType ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                    <input type="checkbox" checked={selectAmountType} onChange={handleChooseAmountGift}
                                           value={selectAmountType ? 1 : 0} className="w-5 h-5" disabled={ selectProductType}/>
                                    <p className=" text-sm"
                                       onClick={() => {
                                           (!selectProductType) && handleChooseAmountGift({target: {checked: !selectAmountType}})
                                       }}>
                                        <span className=" ml-2 ">Fiyat Bazlı mı ? </span>
                                    </p>
                                </div>
                                <div className={`flex  items-start  ${selectAmountType ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                    <input type="checkbox" checked={selectProductType} onChange={handleChooseProductGift}
                                           value={selectProductType ? 1 : 0} className="w-5 h-5" disabled={ (selectAmountType)} />
                                    <p className=" text-sm"
                                       onClick={() => {
                                           (!selectAmountType) && handleChooseProductGift({target: {checked: !selectProductType}})
                                       }}>
                                        <span className=" ml-2 ">Ürün Bazlı mı ? </span>
                                    </p>
                                </div>
                            </div>
                            {
                                selectAmountType && (
                                    <div className="flex flex-col text-sm mt-4 w-52">
                                        <span className="font-semibold mb-[2px] ">Hediye Değeri</span>
                                        <input
                                            type="text"
                                            className="border-[1.11px] p-2 text-sm px-1 outline-none"
                                            placeholder="Hediye Değeri"
                                            onChange={(e) => setGiftPriceText(e.target.value)}
                                        />
                                    </div>
                                )
                            }
                            {
                                selectProductType && (
                                    <div className="flex w-80 my-5">

                                        <select
                                            id="select"
                                            value={productText}
                                            onChange={(e) => setProductText(e.target.value)}
                                            className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-opacity-50 shadow-2xl shadow-cadetGray"
                                        >
                                            <option key={1} value="-1">Ürün Seçiniz</option>
                                            {products.map((option) => (
                                                <option key={option._id} value={option._id}>
                                                    <span>{option.title}</span>
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            }

                            <div className="flex justify-end">
                                <button className="btn-primary  "
                                        onClick={handleCrate}>Create
                                </button>
                            </div>


                        </div>
                    </div>
                </OutsideClickHandler>
                )
                :
                (<div className="flex justify-center items-center mt-3 z-50">
                    <PacmanLoader
                        color="#fff200"
                        cssOverride={{}}
                        loading
                        margin={2}
                        size={36}
                        speedMultiplier={1}
                    />
                </div>)}
        </div>);

}
export default CreateCouponCode;