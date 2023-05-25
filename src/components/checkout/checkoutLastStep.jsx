import {useSession} from "next-auth/react";
import {useDispatch, useSelector} from "react-redux";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import {ProductExtrasActions} from "../../redux/ProductExtras";
import {useRouter} from "next/router";
import Title from "../UI/Title";


const CheckoutLastStep = ({
                              userId,
                              userInfo,
                              cargoName,
                              checkOutPaymentMethod,                   setCompleteCheckout,
                              isLoading,
                              setIsLoading,
                              setCheckOutPaymentInformation,
                              setCheckOutLastStepInformation

                          }) => {
    const {data: session} = useSession()
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch();
    const router = useRouter();
    const shoppingOrderMain = useSelector(state => state.shoppingOrder)


    const shoppingOrder = shoppingOrderMain.shoppingOrder;
    const e_invoice = shoppingOrder[0]?.e_invoice;
    const cargoAddress = shoppingOrder[0]?.cargoAddress;

    const productPageHandler = (product) => {
        const name = "productPage";
        dispatch(ProductExtrasActions.addToExtrasswithRedux(product));
        router.push({
            pathname: "/product/" + product._id.toString(), query: {name},
        })

    }
    const checkOutPaymentInformation = ["Kredi Kartı", "Kayıtlı Kart ile Öde", "iyzico ile Öde"];

    return <div className="px-3">
        <div
            className="flex  lg:flex-row flex-col  leading-6 text-left tracking-wider gap-4 border-b-2 pb-7">
            <div className="lg:basis-1/2 flex flex-col ">
                <div className="place-self-start lg:pt-5 px-1 lg:col-span-1 col-span-full">
                    <div className="flex flex-col items-start gap-[4px] text-sm font-workSans font-light">
                        <p className="font-semibold mb-4">Kargo Adresi</p>
                        <p>{e_invoice?.name} {e_invoice?.surName}</p>
                        <p> {e_invoice?.address}</p>
                        <p> {e_invoice?.country} / {e_invoice?.city} / {e_invoice?.district} </p>
                        <p className="font-semibold my-4 lg:block hidden">Kargo Methodu</p>
                        <p className="lg:block hidden">{cargoName}</p>
                    </div>
                </div>
            </div>
            <div className="lg:basis-1/2 flex flex-col ">
                <div className="place-self-start lg:pt-5 px-1 lg:col-span-1 col-span-full">
                    <div className="flex flex-col items-start gap-[4px] text-sm font-workSans font-light">
                        <p className="font-semibold mb-4">Fatura Adresi</p>
                        <p>{cargoAddress?.name} {cargoAddress?.surName}</p>
                        <p> {cargoAddress?.address}</p>
                        <p> {cargoAddress?.country} / {cargoAddress?.city} / {cargoAddress?.district} </p>
                        <p className="font-semibold my-4 lg:block hidden">Ödeme Bilgileri</p>
                        <p className="lg:block hidden">{checkOutPaymentInformation[checkOutPaymentMethod]}</p>
                    </div>
                </div>
            </div>
            <div className="lg:hidden flex flex-col justify-start px-2.5">
                <div className="flex flex-col text-sm font-workSans font-light">
                    <p className="font-semibold my-4">Kargo Methodu</p>
                    <p>{cargoName}</p>
                    <p className="font-semibold my-4 ">Ödeme Bilgileri</p>
                    <p className="">{checkOutPaymentInformation[checkOutPaymentMethod]}</p>
                </div>
            </div>

        </div>
        <div className="max-h-[17rem] overflow-y-auto">
            <Title className="text-[40px] mt-4  border-b-2 w-full">Siparişlerim</Title>
            {cart.products?.map((product, index) => {
                return <div key={index}

                            className="flex items-start h-[11.375rem] mt-4 border-secondary border-b-[1px] border-opacity-40">

                    <Image src={product.image}
                           alt={`${product.image}`}
                           className="w-auto h-auto md:pr-4 pr-1 md:basis-[23.49%]"
                           width={100}
                           height={100}
                           priority={true}
                           onClick={() => productPageHandler(product)}
                    />
                    <div className="flex md:flex-row flex-col w-full h-full md:static relative">
                        <div
                            className="flex flex-col  items-start text-xs font-semibold font-workSans text-cadetGray ml-2 md:w-full w-[8.5rem]  top-2 md:basis-[43.635%]">
                            <p className="text-base font-semibold text-secondary md:mb-0 mb-1 md:w-ful hover:underline cursor-pointer"
                               onClick={() => productPageHandler(product)}
                            >{product.title}</p>
                            <p className="text-cadetGray md:mb-0 mb-1">
                                            <span
                                                className="text-stateGray font-workSans font-semibold md:w-full max-w-[8.5rem]">
                                        {product.extras.length > 0 ? "Options:" : ""}</span>
                                {product.extras.map(ext => ext.text).join(', ')}
                            </p>
                            <p className="capitalize md:mb-0 mb-2">Category: {product.category}</p>
                        </div>
                        <div
                            className="flex flex-col md:flex-row md:gap-0 gap-2 items-start
                             md:h-full w-full justify-end md:basis-[56.365%] md:mr-2 md:mt-0 mt-2">

                            <div className="flex items-center justify-between md:h-full md:flex-col flex-row">
                                <div
                                    className="flex items-center justify-center w-full md:items-end md:flex-col flex-row md:gap-1 gap-4">
                                    <span
                                        className="line-through text-base md:text-sm text-cadetGray">{new Intl.NumberFormat('tr-TR', {
                                        style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                    }).format((product.price * product.productTotal * 111.43 / 100))}₺
                                    </span>
                                    <span
                                        className="font-semibold font-workSans text-base md:text-[1.2rem] text-primary">
                                                {new Intl.NumberFormat('tr-TR', {
                                                    style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                                }).format((product.price * product.productTotal))}
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            })}
        </div>


    </div>

}
export default CheckoutLastStep