
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {useSession} from "next-auth/react";
import CheckOutAddress from "../../../components/checkout/address";
import CheckOutInformation from "../../../components/checkout/ödemeBilgileri";
import PacmanLoader from "react-spinners/PacmanLoader";
import {FiEdit} from "react-icons/fi";
import {ShoppingOrderActions} from "../../../redux/shoppingOrder";
import CheckoutLastStep from "../../../components/checkout/checkoutLastStep";


const OPC = () => {
    const {data: session} = useSession();

    let cart = useSelector(state => state.cart);

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const [mobileShowBasketDetail, setMobileShowBasketDetail] = useState(false);
    const [checkOutAddressInformation, setCheckOutAddressInformation] = useState(true); //true
    const [checkOutPaymentInformation, setCheckOutPaymentInformation] = useState(false); // false
    const [checkOutLastStepInformation, setCheckOutLastStepInformation] = useState(false); // false

    const [checkOutPaymentMethod, setCheckOutPaymentMethod] = useState(0);

    const [completeAddress,setCompleteAddress]=useState(false);
    const [completeCheckout,setCompleteCheckout]=useState(false);
    const addressSectionRef = useRef(null);
    const checkoutSectionRef = useRef(null);
    const checkoutLastSectionRef = useRef(null);

    const [preInformationForm,setPreInformationForm]=useState(false);
    const [distanceSalesContract,setDistanceSalesContract]=useState(false);




    const cargoName = "GKN Kargo";

    useEffect(() => {
        if (completeAddress === true) {
            if (checkoutSectionRef.current) {
                checkoutSectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }
    }, [completeAddress]);

    useEffect(() => {
        if (completeCheckout === true) {
            if (checkoutLastSectionRef.current) {
                checkoutLastSectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }
    }, [completeCheckout]);

    const handleChangePreFrom = (event) => {
        setPreInformationForm(event.target.checked);
    };
    const handleChangeSalesContract = (event) => {
        setDistanceSalesContract(event.target.checked);
    };

const  handleClickCompletePayment=()=>{

}


    return <div className={`min-h-[calc(100vh_-_433px)] font-workSans  mt-10 relative`}>
        <div className="flex justify-between  lg:flex-row flex-col m-auto  max-w-[70rem]">
            <div className={`lg:basis-[68%] py-4 lg:px-8 px-4    ${mobileShowBasketDetail ?
                "after:content[''] after:absolute after:top-0 after:left-0 after:bg-[#212529] after:w-full after:h-full after:opacity-70 after:z-20" : ""} `}
                 onClick={() => {
                     mobileShowBasketDetail && setMobileShowBasketDetail(!mobileShowBasketDetail)
                 }}
            >
                       <div className=" w-full relative " >
                           <div className={`flex items-center justify-between py-6 border-t-2 border-b-2 
                           ${checkOutAddressInformation === false ? "!text-green-500" : "text-payneGray"}`} >
                               <div className="text-[1.5rem] " ref={addressSectionRef}> 1. Teslimat Bilgileri</div>
                               {
                                   !checkOutAddressInformation && (
                                       <div className="flex items-center justify-center cursor-pointer"
                                       onClick={()=>{
                                               setCheckOutPaymentInformation(false);
                                               setCheckOutAddressInformation(true);

                                               dispatch(ShoppingOrderActions.deleteShoppingOrder(""))
                                    }
                                       } >
                                    <FiEdit className="md:text-2xl lg:text-lg sm:text-base xs:text-sm text-lg lg:ml-4  "/>
                                   <span className="text-xs hover:underline ">Düzenle</span>
                               </div>)
                               }
                           </div>
                           {checkOutAddressInformation && session?.user?.id &&
                         (      <CheckOutAddress
                                   userId={session?.user?.id}
                                   isLoading={isLoading}
                                   setIsLoading={setIsLoading}
                                   setCheckOutAddressInformation={setCheckOutAddressInformation}
                                   setCheckOutPaymentInformation={setCheckOutPaymentInformation}
                                   addressSectionRef={addressSectionRef}
                                   setCompleteAddress={setCompleteAddress}
                               />)
                           }
                       </div>

                <div className=" w-full  border-b-2 py-2"  ref={checkoutSectionRef}>
                    <div className={`flex items-center justify-between py-6 ${checkOutPaymentInformation === false ? "!text-green-500" : "text-payneGray"}`} >
                        <div className="text-[1.5rem] "> 2. Ödeme Bilgileri</div>
                        {
                            !checkOutAddressInformation && (
                                <div className="flex items-center justify-center cursor-pointer "
                                     onClick={()=>{
                                         setCheckOutPaymentInformation(true);
                                         setCheckOutAddressInformation(false);
                                         dispatch(ShoppingOrderActions.deleteShoppingOrder(""))
                                     }
                                     }

                                >
                                    <FiEdit className="md:text-2xl lg:text-lg sm:text-sm xs:text-sm text-lg lg:ml-4"/>
                                    <span className="text-xs hover:underline ">Düzenle</span>
                                </div>)
                        }
                    </div>
                    {checkOutPaymentInformation && session?.user?.id &&
                      (  <CheckOutInformation
                            userId={session?.user?.id}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            setCheckOutPaymentInformation={setCheckOutPaymentInformation}
                            setCheckOutLastStepInformation={setCheckOutLastStepInformation}
                            setCheckOutPaymentMethod={setCheckOutPaymentMethod}
                            checkOutPaymentMethod={checkOutPaymentMethod}
                            setCompleteCheckout={setCompleteCheckout}

                        />)
                    }
                </div>
                <div className=" w-full  border-b-2 py-2" >
                    <div className={`flex items-center justify-between py-6 ${setCheckOutPaymentInformation === false ? "!text-green-500" : "text-payneGray"}`} >
                        <div className="text-[1.5rem] " ref={checkoutLastSectionRef}> 3. Siparişi Tamamlamak için Son Adım</div>
                        {
                            !checkOutLastStepInformation && (
                                <div className="flex items-center justify-center cursor-pointer"

                                >
                                    <FiEdit className="md:text-2xl lg:text-lg sm:text-base xs:text-sm text-lg lg:ml-4"/>
                                    <span className="text-xs hover:underline ">Düzenle</span>
                                </div>)
                        }
                    </div>
                    {checkOutLastStepInformation && session?.user?.id &&
                        (  <CheckoutLastStep
                            userId={session?.user?.id}
                            cargoName={cargoName}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            setCheckOutPaymentInformation={setCheckOutPaymentInformation}
                            setCheckOutLastStepInformation={setCheckOutLastStepInformation}
                            checkOutPaymentMethod={checkOutPaymentMethod}
                        />)
                    }
                </div>

                <div className="lg:hidden block px-2 mt-10">
                    <div className="flex gap-2 items-start mt-5 cursor-pointer">
                        <input type="checkbox" checked={preInformationForm} onChange={handleChangePreFrom}
                               value={preInformationForm ? 1 : 0} className="w-5 h-5 mt-2"/>
                        <p className=" text-sm"
                           onClick={() => handleChangePreFrom({ target: { checked: !preInformationForm } })}>
                            <span className="underline">Ön bilgilendirme formunu </span>
                            <span>okudum ve kabul ediyorum.</span>
                        </p>
                    </div>
                    <div className="flex gap-2 items-start mt-5 cursor-pointer">
                        <input type="checkbox" checked={distanceSalesContract} onChange={handleChangeSalesContract}
                               value={distanceSalesContract ? 1 : 0} className="w-5 h-5 mt-2"/>
                        <p className=" text-sm"
                           onClick={() => handleChangeSalesContract({ target: { checked: !distanceSalesContract } })}>
                            <span className="underline ">Mesafeli satış sözleşmesini </span>
                            <span>okudum ve onaylıyorum.</span>
                        </p>
                    </div>
                </div>

            </div>


            <div
                className={` lg:basis-[32%] w-full flex items-center justify-center md:block hidden
                         h-full sticky  mt-8 lg:mb-0  mb-[6.6rem]`}>
                <div
                    className={`h-[11.255rem] w-full  border-[1.5px] font-medium  rounded-lg `}>
                    <div className="p-[0.948rem]">
                        <div className="text-[1.063rem] md:mt-0 mt-10 font-workSans mb-5">Sipariş Özeti</div>
                        <div className="text-sm font-sans self-start text-left pb-3 ">
                            <div
                                className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] mb-2">
                                <span className="text-sm">Ara Toplam</span>
                                <span className=" font-semibold">{new Intl.NumberFormat('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY',
                                    minimumFractionDigits: 2
                                }).format((cart.total))}₺</span>
                            </div>
                            <div
                                className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] pb-2 border-b-[1.11px] ">
                                <span className="text-sm">Kargo Ücreti</span>
                                <span className=" font-semibold">Ücretsiz Kargo</span>
                            </div>

                            <div
                                className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] mt-2  ">
                                <span className="text-base font-bold ">Toplam</span>
                                <span className=" font-semibold">{new Intl.NumberFormat('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY',
                                    minimumFractionDigits: 2
                                }).format((cart.total))}₺</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:block hidden px-2 mt-10">
                        <div className="flex gap-2 items-start mt-5 cursor-pointer">
                            <input type="checkbox" checked={preInformationForm} onChange={handleChangePreFrom}
                                   value={preInformationForm ? 1 : 0} className="w-5 h-5 mt-2"/>
                            <p className=" text-sm"
                               onClick={() => handleChangePreFrom({ target: { checked: !preInformationForm } })}>
                                <span className="underline">Ön bilgilendirme formunu </span>
                                <span>okudum ve kabul ediyorum.</span>
                            </p>
                        </div>
                        <div className="flex gap-2 items-start mt-5 cursor-pointer">
                            <input type="checkbox" checked={distanceSalesContract} onChange={handleChangeSalesContract}
                                   value={distanceSalesContract ? 1 : 0} className="w-5 h-5 mt-2"/>
                            <p className=" text-sm"
                               onClick={() => handleChangeSalesContract({ target: { checked: !distanceSalesContract } })}>
                                <span className="underline ">Mesafeli satış sözleşmesini </span>
                                <span>okudum ve onaylıyorum.</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <div className={`fixed bottom-0 bg-primary px-6 pb-6 pt-2 w-full md:hidden block 
            ${mobileShowBasketDetail ? "z-50 " : "border-t-[1px] border-tertiary"}
            `}>

                <div
                    className={`flex items-center justify-between flex-row mt-1  font-semibold ${mobileShowBasketDetail ? "mb-3" : "mb-[-0.2rem]"}`}>
                    <div className={`flex item-center justify-center gap-2 `}>
            <span className="place-self-start" onClick={() => setMobileShowBasketDetail(!mobileShowBasketDetail)}>
        {mobileShowBasketDetail ? (<i className="fa-solid fa-chevron-down fa-xs"></i>) : (
            <i className="fa-sharp fa-solid fa-angle-up fa-xs"></i>)}
            </span>
                        <span>Toplam</span>
                    </div>
                    <div>{new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                        minimumFractionDigits: 2
                    }).format((cart.total))}₺
                    </div>
                </div>
                {mobileShowBasketDetail && <>
                    <div className="  border-t-2  ">
                        <div className="flex  flex-row items-center justify-between mt-5">
                            <span>Ara Toplam</span>
                            <span>{new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                                minimumFractionDigits: 2
                            }).format((cart.total))}₺</span>
                        </div>
                    </div>
                    <div className=" flex items-center justify-between mt-2 flex-row  ">
                        <span>Kargo Ücreti</span>
                        <span>Ücretsiz Kargo</span>
                    </div>
                </>}
                <button
                    className="w-full p-2 bg-tertiary text-secondary  mt-3 uppercase text-sm font-semibold"
                    onClick={handleClickCompletePayment}
                >
                    Sepeti onayla
                </button>
            </div>

        </div>
        {  isLoading && (
            <div className="absolute top-0 left-0 w-full h-full bg-tertiary opacity-50 z-40">
                <div className="flex items-center bg-black text-tertiary justify-center w-full h-full z-50">
                    <div className="lg:block hidden">
                        <PacmanLoader
                            color="#f1f2f3"
                            cssOverride={{}}
                            loading
                            margin={2}
                            size={56}
                            speedMultiplier={1}
                        />
                    </div>
                    <div className="lg:hidden block">
                        <PacmanLoader
                            color="#f1f2f3"
                            cssOverride={{}}
                            loading
                            margin={2}
                            size={36}
                            speedMultiplier={1}
                        />
                    </div>

                </div>
            </div>
        )
        }
    </div>
}

export default OPC;