import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styles from "./opc.module.css"

import {useSession} from "next-auth/react";
import CheckOutAddress from "../../../components/checkout/address";
import CheckOutInformation from "../../../components/checkout/ödemeBilgileri";
import PacmanLoader from "react-spinners/PacmanLoader";
import {FiEdit} from "react-icons/fi";
import {ShoppingOrderActions} from "../../../redux/shoppingOrder";
import CheckoutLastStep from "../../../components/checkout/checkoutLastStep";
import axios from "axios";
import {cartActions} from "../../../redux/cartSlice";
import {cartIndexActions} from "../../../redux/cartIndex";

import {useRouter} from "next/router";
import {toast} from "react-toastify";



const OPC = () => {
    const {data: session} = useSession();
    const router =useRouter();
    let cart = useSelector(state => state.cart);
    const shoppingOrderMain = useSelector(state => state.shoppingOrder);

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const [mobileShowBasketDetail, setMobileShowBasketDetail] = useState(false);
    const [checkOutAddressInformation, setCheckOutAddressInformation] = useState(true); //true
    const [checkOutPaymentInformation, setCheckOutPaymentInformation] = useState(false); // false
    const [completePaymentInformation, setCompletePaymentInformation] = useState(false); // false
    const [checkOutLastStepInformation, setCheckOutLastStepInformation] = useState(false); // false

    const [checkOutPaymentMethod, setCheckOutPaymentMethod] = useState(0);
    const [userInfo, setUserInfo] = useState([]);
    const [isCardInValid, setIsCardInValid] = useState(false);
    const [cardPaymentInformation, setCardPaymentInformation] = useState({});


    const [completeAddress, setCompleteAddress] = useState(false);
    const [completeCheckout, setCompleteCheckout] = useState(false);
    const addressSectionRef = useRef(null);
    const checkoutSectionRef = useRef(null);
    const checkoutLastSectionRef = useRef(null);
    const [lastSectionScroll,setLastSectionScroll]=useState(false);

    const [preInformationForm, setPreInformationForm] = useState(false);
    const [distanceSalesContract, setDistanceSalesContract] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');

    const cargoName = "GKN Kargo";


    useEffect(() => {

            if (checkoutSectionRef.current) {
                checkoutSectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            }

    }, [completeAddress]);


    useEffect(() => {
        if (completeCheckout === true) {
            if (checkoutLastSectionRef.current) {
                checkoutLastSectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }
    }, [completeCheckout,lastSectionScroll]);
    //-------------------------------------------------------


    useEffect(() => {
        const getUser = async () => {
            if (session?.user?.id) {
                const queryParams = `userId=${session?.user?.id}`;
                const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-shopping-cart/${queryParams}`;
                const res = await axios.get(url);
                setUserInfo(() => [res.data.products, res.data.userId, res.data.shoppingCartId, res.data.currency]);
                console.log("res.data",res.data)
                dispatch(cartActions.reset());
                dispatch(cartActions.resetOther());
                res.data.products.map((item, index) => {
                    const {product, ...rest} = item;
                    dispatch(cartIndexActions.addToCartIndex());
                    dispatch(cartActions.addProductbyDb({...product, ...rest, addIndex: index}))
                })

                res.data.cargoPrice &&  dispatch(cartActions.addCargoPrice(parseInt(res.data?.cargoPrice)));
                res.data.couponPrice &&  dispatch(cartActions.setCouponId({
                    couponAmount: res.data?.couponPrice,
                    couponId: res.data?.couponId
                }));

            }
        }
        getUser();
    }, [session?.user?.id]);



    const [basketCompleteError,setBasketCompleteError]=useState(true);

    useEffect(()=>{
        if(preInformationForm === true && distanceSalesContract === true){

            setBasketCompleteError(()=> true);
        }else{

            setBasketCompleteError(()=> false);
        }
    },[preInformationForm,distanceSalesContract,setBasketCompleteError])

    const handleClickCompletePayment = async () => {


            if(preInformationForm === true && distanceSalesContract === true){
                const shoppingOrder = shoppingOrderMain.shoppingOrder;

                const e_invoice = shoppingOrder[0].e_invoice;
                const cargoAddress = shoppingOrder[0].cargoAddress;
                if (e_invoice && cargoAddress) {

                }

                if (checkOutPaymentMethod === 0) {

                    const notSelectCard = {
                        products: userInfo[0],
                        userId: userInfo[1],
                        shoppingCartId: userInfo[2],
                        currency: userInfo[3],
                        e_invoice,
                        cargoAddress,
                        total: cart.total,
                        paidPrice:cart.mainTotal,
                        cargoPrice:cart?.cargoPrice,
                        couponCode:cart?.couponCart?.couponAmount,
                        couponName:cart?.couponCart?.couponId,
                        totalQuantity: cart.totalQuantity,
                        cardHolderName: cardPaymentInformation.cardHolderName,
                        expireYear: cardPaymentInformation.yearText,
                        expireMonth: cardPaymentInformation.monthText,
                        cardNumber: cardPaymentInformation.cardNumber,
                        cvc: cardPaymentInformation.cardCvv,
                        registerCard: cardPaymentInformation.registerCardCheckBox,
                        isSave: false
                    };
                    if (cardPaymentInformation.registerCardCheckBox === "1") {

                        notSelectCard.cardAlias = cardPaymentInformation.cardAlias;

                    }

                    try {

                        let url;
                        if (cardPaymentInformation.isChecked3DCard) {
                            url = `${process.env.NEXT_PUBLIC_API_URL}/payment_threeds/payments/cart-addPayment`

                        } else {
                            url = `${process.env.NEXT_PUBLIC_API_URL}/payment/cart-addPayment`

                        }

                        if (url !== null) {
                            const res = await axios.post(url, notSelectCard)
                            if (res.status === 200){
                                toast.success("Creating Your Order")
                                await router.push("/")
                                dispatch(cartActions.reset())
                                dispatch(cartActions.resetOther());
                                dispatch(ShoppingOrderActions.deleteShoppingOrder())
                            }
                        }

                    } catch (err) {
                        if (err.response.data.message.trim() === "Kart numarası geçersizdir") {
                            setIsCardInValid(true);
                        }
                        setCompleteAddress(false);
                        setCheckOutPaymentInformation(true);
                        setCheckOutAddressInformation(false);
                        setCheckOutLastStepInformation(false);
                        console.log("err", err)


                    }
                }
                if (checkOutPaymentMethod === 1) {

                    const selectCardOrder = {
                        products: userInfo[0],
                        userId: userInfo[1],
                        shoppingCartId: userInfo[2],
                        currency: userInfo[3],
                        e_invoice,
                        cargoAddress,
                        total: cart.total,
                        paidPrice:cart.mainTotal,
                        cargoPrice:cart?.cargoPrice,
                        couponCode:cart.couponCart?.couponAmount,
                        couponName:cart.couponCart?.couponId,
                        totalQuantity: cart.totalQuantity,
                        isSave: true
                    };


                    try {
                        const queryParams = `cardIndex=${cardPaymentInformation.selectCard}`;
                        let url;
                        if (cardPaymentInformation.isChecked3DCard) {
                            url = `${process.env.NEXT_PUBLIC_API_URL}/payment_threeds/payments/cart-addPayment?${queryParams}`
                            const res3D = await axios.post(url, selectCardOrder)
                            if (res3D.status === 200){
                                console.log("Res3D",res3D.data)
                                await router.push("/")
                                dispatch(cartActions.reset())
                                dispatch(cartActions.resetOther());
                                dispatch(ShoppingOrderActions.deleteShoppingOrder())
                            }
                        } else {

                            url = `${process.env.NEXT_PUBLIC_API_URL}/payment/cart-addPayment?${queryParams}`
                            const res = await axios.post(url, selectCardOrder)
                            if (res.status === 200){
                                toast.success("Creating Your Order")
                                await router.push("/")
                                dispatch(cartActions.reset())
                                dispatch(cartActions.resetOther());
                                dispatch(ShoppingOrderActions.deleteShoppingOrder())
                            }
                        }


                    } catch (err) {
                        toast.error(err.response.data.message)
                        console.log("Res", err)
                        setCompleteAddress(false);
                        setCheckOutPaymentInformation(true);
                        setCheckOutAddressInformation(false);
                        setCheckOutLastStepInformation(false);
                    }
                }

                if (checkOutPaymentMethod === 2) {
                    const shoppingOrder = shoppingOrderMain.shoppingOrder;

                    const e_invoice = shoppingOrder[0].e_invoice;
                    const cargoAddress = shoppingOrder[0].cargoAddress;

                    const selectCardOrder = {
                        products: userInfo[0],
                        userId: userInfo[1],
                        shoppingCartId: userInfo[2],
                        currency: userInfo[3],
                        e_invoice,
                        cargoAddress,
                        total: cart.total,
                        paidPrice:cart.mainTotal,
                        cargoPrice:cart?.cargoPrice,
                        couponCode:cart.couponCart?.couponAmount,

                        couponName:cart.couponCart?.couponId,
                        totalQuantity: cart.totalQuantity,
                        isSave: true
                    };
                    try {
                        const url = `${process.env.NEXT_PUBLIC_API_URL}/checkout/payments/cart-addPayment`
                        if (userInfo) {
                            const res=await axios.post(url, selectCardOrder)


                            if (res.status === 200){
                                toast.success("Creating Your Order")
                                await router.push(res.data);

                                dispatch(cartActions.reset())
                                dispatch(cartActions.removeCargoPrice())
                                dispatch(cartActions.removeCouponId())
                                dispatch(ShoppingOrderActions.deleteShoppingOrder())
                            }
                        }

                    } catch (err) {
                        toast.error(err.response.data.message)
                        setCompleteAddress(false);
                        setCheckOutPaymentInformation(true);
                        setCheckOutAddressInformation(false);
                        setCheckOutLastStepInformation(false);
                    }
                }

            }

    }


    //________________________________________

    const handleChangePreFrom = (event) => {
        setPreInformationForm(event.target.checked);
    };
    const handleChangeSalesContract = (event) => {
        setDistanceSalesContract(event.target.checked);
    };


    return<>
        <div className={`min-h-[calc(100vh_-_433px)] font-workSans  mt-10 relative`}>
            <div className="flex justify-between  lg:flex-row flex-col m-auto  max-w-[70rem]">
                <div className={`lg:basis-[68%] py-4 lg:px-8 px-4    ${mobileShowBasketDetail ?
                    "after:content[''] after:absolute after:top-0 after:left-0 after:bg-[#212529] after:w-full after:h-full after:opacity-70 after:z-20" : ""} `}
                     onClick={() => {
                         mobileShowBasketDetail && setMobileShowBasketDetail(!mobileShowBasketDetail)
                     }}
                >
                    <div className=" w-full relative ">
                        <div className={`flex items-center justify-between py-6 border-t-2 border-b-2 
                           ${checkOutAddressInformation === false ? "!text-green-500" : "text-payneGray"}`}>
                            <div className="text-[1.5rem] " ref={addressSectionRef}> 1. Teslimat Bilgileri</div>
                            {
                                !checkOutAddressInformation && (
                                    <div className="flex items-center justify-center cursor-pointer"
                                         onClick={() => {
                                             setCheckOutPaymentInformation(false);
                                             setCheckOutAddressInformation(true);
                                             setCheckOutLastStepInformation(false);

                                             dispatch(ShoppingOrderActions.deleteShoppingOrder(""))
                                         }
                                         }>
                                        <FiEdit className="md:text-2xl lg:text-lg sm:text-base xs:text-sm text-lg lg:ml-4  "/>
                                        <span className="text-xs hover:underline ">Düzenle</span>
                                    </div>)
                            }
                        </div>
                        {checkOutAddressInformation && session?.user?.id &&
                            (<CheckOutAddress
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

                    <div className=" w-full  border-b-2 py-2" ref={checkoutSectionRef}>
                        <div
                            className={`flex items-center justify-between py-6 ${completePaymentInformation && completeAddress ? "!text-green-500" : "text-payneGray"}`}>
                            <div className="text-[1.5rem] "> 2. Ödeme Bilgileri</div>
                            {
                                !checkOutPaymentInformation && (
                                    <div className="flex items-center justify-center cursor-pointer "
                                         onClick={() => {
                                             setCheckOutPaymentInformation(true);
                                             setCheckOutAddressInformation(false);
                                             setCheckOutLastStepInformation(false);
                                         }
                                         }

                                    >
                                        {completeAddress && (<> <FiEdit className="md:text-2xl lg:text-lg sm:text-sm xs:text-sm text-lg lg:ml-4"/>
                                            <span className="text-xs hover:underline ">Düzenle</span></>)}
                                    </div>)
                            }
                        </div>
                        {checkOutPaymentInformation && session?.user?.id &&
                            (<CheckOutInformation
                                userId={session?.user?.id}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                setCheckOutPaymentInformation={setCheckOutPaymentInformation}
                                setCompletePaymentInformation={setCompletePaymentInformation}
                                setCheckOutLastStepInformation={setCheckOutLastStepInformation}
                                setCheckOutPaymentMethod={setCheckOutPaymentMethod}
                                checkOutPaymentMethod={checkOutPaymentMethod}
                                setCompleteCheckout={setCompleteCheckout}
                                setCardPaymentInformation={setCardPaymentInformation}
                                isCardInValid={isCardInValid}
                                userInfo={userInfo}

                            />)
                        }
                    </div>
                    <div className=" w-full  border-b-2 py-2">
                        <div
                            className={`flex items-center justify-between py-6 ${setCheckOutPaymentInformation === false ? "!text-green-500" : "text-payneGray"}`}>
                            <div className="text-[1.5rem] " ref={checkoutLastSectionRef}> 3. Siparişi Tamamlamak için Son
                                Adım
                            </div>
                            {
                                !checkOutLastStepInformation && (
                                    <div className="flex items-center justify-center cursor-pointer"
                                         onClick={() => {
                                             setCheckOutPaymentInformation(false);
                                             setCheckOutAddressInformation(false);
                                             setCheckOutLastStepInformation(true);
                                         }
                                         }

                                    >
                                        {completeAddress && completePaymentInformation && (<> <FiEdit className="md:text-2xl lg:text-lg sm:text-sm xs:text-sm text-lg lg:ml-4"/>
                                            <span className="text-xs hover:underline ">Düzenle</span></>)}
                                    </div>)
                            }
                        </div>
                        {checkOutLastStepInformation && session?.user?.id &&
                            (<CheckoutLastStep
                                userId={session?.user?.id}
                                userInfo={userInfo}
                                cargoName={cargoName}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                setCheckOutPaymentInformation={setCheckOutPaymentInformation}
                                setCheckOutLastStepInformation={setCheckOutLastStepInformation}
                                checkOutPaymentMethod={checkOutPaymentMethod}
                            />)
                        }
                    </div>

                    {
                        checkOutLastStepInformation && (
                            <div className="border-b-2 pb-10 border-stateGray">
                                <div className="px-3">
                                    <div>
                                        <div className="font-semibold mt-5 border-b-2 pb-4">Ön Bilgilendirme Formu</div>
                                        <div className="h-[10rem]  w-full overflow-y-auto mt-5 bg-iyzicoBg mt-2 p-4  leading-6 text-left tracking-wider lg:text-payneGray text-stateGray lg:text-base text-sm">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad architecto autem cum cumque
                                            earum est,
                                            fugit illo ipsa iure laudantium nam, nostrum odio quasi quis quod repudiandae totam. Animi
                                            cum, ducimus
                                            illo libero quae quia tenetur totam vel. Assumenda at commodi cumque, debitis dignissimos
                                            dolor enim et
                                            fuga laborum magnam maxime necessitatibus nemo nihil odio porro quo, sapiente soluta! Ab
                                            adipisci
                                            assumenda debitis doloremque ea earum, facilis harum iste maiores maxime necessitatibus,
                                            possimus
                                            provident quia soluta veniam voluptas voluptate, voluptates. Animi consequuntur culpa
                                            debitis eius hic
                                            id iusto libero molestiae molestias officiis provident, quasi, reiciendis sunt ut vel velit
                                            voluptate!
                                            Cupiditate dignissimos minima minus, natus perferendis qui quos? Adipisci amet culpa
                                            cupiditate debitis
                                            earum labore magnam magni molestias nihil non, qui reiciendis voluptatibus! Dolore eligendi
                                            facere fugit
                                            illum perspiciatis quisquam sit soluta! Culpa earum excepturi explicabo iure, laborum
                                            maiores minima
                                            quidem rerum sit ut vel voluptatibus? Animi asperiores distinctio dolorem eius explicabo
                                            labore magni
                                            obcaecati odit officiis qui, quidem quis sunt temporibus! Aliquam architecto asperiores
                                            aspernatur
                                            commodi consectetur corporis cumque cupiditate deleniti dicta dignissimos distinctio dolor
                                            dolores ea
                                            enim esse et eveniet exercitationem illo ipsa laborum laudantium magnam mollitia
                                            necessitatibus neque
                                            non nostrum officia officiis perferendis quibusdam quidem quo reprehenderit, unde
                                            voluptatibus. Aliquam
                                            aliquid amet autem cumque, distinctio ducimus eligendi eveniet modi officia perferendis
                                            possimus quae
                                            quam recusandae repellendus repudiandae sequi, suscipit tempore veritatis? Accusantium ad
                                            aperiam
                                            asperiores blanditiis doloribus earum eius eligendi impedit iste mollitia neque officiis
                                            placeat quasi,
                                            sapiente similique unde voluptatem. Adipisci animi corporis cum deleniti, dignissimos earum
                                            esse est
                                            facilis hic in incidunt ipsam iure iusto magnam modi numquam officiis perferendis quaerat
                                            quasi
                                            quibusdam quisquam quo repellat soluta tempora tempore tenetur totam vero? Ad aliquam
                                            aperiam,
                                            architecto corporis delectus deleniti dolores doloribus eos, eum exercitationem explicabo
                                            fugiat
                                            laudantium nesciunt, non officiis pariatur porro quia sint veritatis?
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <div className="font-semibold mt-5 border-b-2 py-4">Mesafeli Satış Sözleşmesi</div>
                                        <div className="h-[10rem]  w-full overflow-y-auto mt-5 bg-iyzicoBg mt-2 p-4  leading-6 text-left tracking-wider lg:text-payneGray text-stateGray lg:text-base text-sm">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad architecto autem cum cumque
                                            earum est,
                                            fugit illo ipsa iure laudantium nam, nostrum odio quasi quis quod repudiandae totam. Animi
                                            cum, ducimus
                                            illo libero quae quia tenetur totam vel. Assumenda at commodi cumque, debitis dignissimos
                                            dolor enim et
                                            fuga laborum magnam maxime necessitatibus nemo nihil odio porro quo, sapiente soluta! Ab
                                            adipisci
                                            assumenda debitis doloremque ea earum, facilis harum iste maiores maxime necessitatibus,
                                            possimus
                                            provident quia soluta veniam voluptas voluptate, voluptates. Animi consequuntur culpa
                                            debitis eius hic
                                            id iusto libero molestiae molestias officiis provident, quasi, reiciendis sunt ut vel velit
                                            voluptate!
                                            Cupiditate dignissimos minima minus, natus perferendis qui quos? Adipisci amet culpa
                                            cupiditate debitis
                                            earum labore magnam magni molestias nihil non, qui reiciendis voluptatibus! Dolore eligendi
                                            facere fugit
                                            illum perspiciatis quisquam sit soluta! Culpa earum excepturi explicabo iure, laborum
                                            maiores minima
                                            quidem rerum sit ut vel voluptatibus? Animi asperiores distinctio dolorem eius explicabo
                                            labore magni
                                            obcaecati odit officiis qui, quidem quis sunt temporibus! Aliquam architecto asperiores
                                            aspernatur
                                            commodi consectetur corporis cumque cupiditate deleniti dicta dignissimos distinctio dolor
                                            dolores ea
                                            enim esse et eveniet exercitationem illo ipsa laborum laudantium magnam mollitia
                                            necessitatibus neque
                                            non nostrum officia officiis perferendis quibusdam quidem quo reprehenderit, unde
                                            voluptatibus. Aliquam
                                            aliquid amet autem cumque, distinctio ducimus eligendi eveniet modi officia perferendis
                                            possimus quae
                                            quam recusandae repellendus repudiandae sequi, suscipit tempore veritatis? Accusantium ad
                                            aperiam
                                            asperiores blanditiis doloribus earum eius eligendi impedit iste mollitia neque officiis
                                            placeat quasi,
                                            sapiente similique unde voluptatem. Adipisci animi corporis cum deleniti, dignissimos earum
                                            esse est
                                            facilis hic in incidunt ipsam iure iusto magnam modi numquam officiis perferendis quaerat
                                            quasi
                                            quibusdam quisquam quo repellat soluta tempora tempore tenetur totam vero? Ad aliquam
                                            aperiam,
                                            architecto corporis delectus deleniti dolores doloribus eos, eum exercitationem explicabo
                                            fugiat
                                            laudantium nesciunt, non officiis pariatur porro quia sint veritatis?
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <div className="lg:hidden block px-2 mt-10">
                        <div className="flex gap-2 items-start mt-5 cursor-pointer">
                            <input type="checkbox" checked={preInformationForm} onChange={handleChangePreFrom}
                                   value={preInformationForm ? 1 : 0} className="w-5 h-5 mt-2"/>
                            <p className=" text-sm"
                               onClick={() => handleChangePreFrom({target: {checked: !preInformationForm}})}>
                                <span className="underline">Ön bilgilendirme formunu </span>
                                <span>okudum ve kabul ediyorum.</span>
                            </p>
                        </div>
                        <div className="flex gap-2 items-start mt-5 cursor-pointer">
                            <input type="checkbox" checked={distanceSalesContract} onChange={handleChangeSalesContract}
                                   value={distanceSalesContract ? 1 : 0} className="w-5 h-5 mt-2"/>
                            <p className=" text-sm"
                               onClick={() => handleChangeSalesContract({target: {checked: !distanceSalesContract}})}>
                                <span className="underline ">Mesafeli satış sözleşmesini </span>
                                <span>okudum ve onaylıyorum.</span>
                            </p>
                        </div>

                    </div>

                </div>


                <div
                    className={` lg:basis-[32%] w-full flex items-center justify-center 
                    lg:block hidden
                         h-full sticky  mt-8 lg:mb-0  mb-[6.6rem]`}>
                    <div
                        className={`min-h-[11.255rem] w-full  border-[1.5px] font-medium  rounded-lg `}>
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
                                    <span className=" font-semibold">{new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                        minimumFractionDigits: 2
                                    }).format((cart.cargoPrice))}</span>
                                </div>
                                {
                                    cart.couponCart?.couponAmount && ( <div
                                        className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] pb-2 border-b-[1.11px] ">
                                        <span className="text-sm">Kupon </span>
                                        <span className=" font-semibold">-{new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                            minimumFractionDigits: 2
                                        }).format((cart.couponCart?.couponAmount))}</span>
                                    </div>)
                                }

                                <div
                                    className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] mt-2  ">
                                    <span className="text-base font-bold ">Toplam</span>
                                    <span className=" font-semibold">{new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                        minimumFractionDigits: 2
                                    }).format((cart.mainTotal))}₺</span>
                                </div>
                            </div>
                        </div>
                        {checkOutLastStepInformation && (
                            <div className={`lg:block hidden px-2 py-5 mt-10 ${!basketCompleteError ? " border-[1.4px] border-red-400  relative":""}`}>
                                {!basketCompleteError && (
                                    <div
                                        className="absolute top-10 left-[-17rem] bg-red-400 px-10 py-3 text-tertiary"> Sözleşmeleri Onaylayınız</div>)}
                                <div className="flex gap-2 items-start mt-5 cursor-pointer">
                                    <input type="checkbox" checked={preInformationForm} onChange={handleChangePreFrom}
                                           value={preInformationForm ? 1 : 0} className="w-5 h-5 mt-2"/>
                                    <p className=" text-sm"
                                       onClick={() => {
                                           setLastSectionScroll(()=> {
                                               !lastSectionScroll
                                           });
                                           handleChangePreFrom({target: {checked: !preInformationForm}})
                                       }}>
                                        <span className="underline">Ön bilgilendirme formunu </span>
                                        <span>okudum ve kabul ediyorum.</span>
                                    </p>
                                </div>
                                <div className="flex gap-2 items-start mt-5 cursor-pointer">
                                    <input type="checkbox" checked={distanceSalesContract} onChange={handleChangeSalesContract}
                                           value={distanceSalesContract ? 1 : 0} className="w-5 h-5 mt-2"/>
                                    <p className=" text-sm"
                                       onClick={() => {
                                           setLastSectionScroll(()=> {
                                               !lastSectionScroll
                                           });
                                           handleChangeSalesContract({target: {checked: !distanceSalesContract}})
                                       }}>
                                        <span className="underline ">Mesafeli satış sözleşmesini </span>
                                        <span>okudum ve onaylıyorum.</span>
                                    </p>
                                </div>
                                <button
                                    disabled={!basketCompleteError}
                                    className={`w-full p-2.5 bg-primary hover:bg-primaryBold rounded-lg
                                 text-tertiary  mt-3 uppercase text-sm font-semibold `}
                                    onClick={handleClickCompletePayment}
                                >
                                    Sepeti Tamamla
                                </button>
                            </div>)}


                    </div>
                </div>

                <div className={`fixed bottom-0 bg-primary px-6 pb-6 pt-2 w-full lg:hidden block 
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
                        }).format((cart.mainTotal))}₺
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
                                }).format((cart.total))}</span>
                            </div>
                        </div>
                        <div className=" flex items-center justify-between mt-2 flex-row  ">
                            <span>Kargo Ücreti</span>
                            <span>{new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                                minimumFractionDigits: 2
                            }).format((cart.cargoPrice))}</span>
                        </div>
                        {
                            cart.couponCart?.couponAmount && (                            <div
                                className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] pb-2 border-b-[1.11px] ">
                                <span className="text-sm">Kupon </span>
                                <span className=" font-semibold">-{new Intl.NumberFormat('tr-TR', {
                                    style: 'currency',
                                    currency: 'TRY',
                                    minimumFractionDigits: 2
                                }).format((cart.couponCart?.couponAmount))}</span>
                            </div>)
                        }
                    </>}
                    <button
                        className={`w-full p-2  text-secondary  mt-3 uppercase text-sm font-semibold ${basketCompleteError ? "bg-tertiary text-secondary" : `${styles.checkOutComplete} text-tertiary bg-gray-700 `}`}

                        onClick={handleClickCompletePayment}
                    >
                        Sepeti Tamamla
                    </button>
                </div>

            </div>
            {isLoading && (
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
    </>

}

export default OPC;