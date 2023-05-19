import React, {useEffect, useRef, useState} from "react";
import dataMonth from "../../libs/countryData/month.json"
import dataYear from "../../libs/countryData/year.json"

import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {cartActions} from "../../redux/cartSlice";
import {useSession} from "next-auth/react";
import {ShoppingOrderActions} from "../../redux/shoppingOrder";
import {cartIndexActions} from "../../redux/cartIndex";
import {AiFillCheckCircle, AiOutlineCheckCircle} from "react-icons/ai";
import {RxCircle} from "react-icons/rx";
import Image from "next/image";

let lookup = require('binlookup')()

const CheckOutInformation = ({
                                 userId,
                                 setCheckOutPaymentMethod,
                                 checkOutPaymentMethod,
                                 setCompleteCheckout,
                                 isLoading,
                                 setIsLoading,
                                 setCheckOutPaymentInformation,
                                 setCheckOutLastStepInformation
                             }) => {
    const {data: session} = useSession()
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch();


    const [showSaveCardList, setShowSaveCardList] = useState(false);
    const [cardList, setCardList] = useState([]);
    const [selectCard, setSelectCard] = useState("0");

    const [isCheckedSaveCard, setCheckedSaveCard] = useState(false);
    const saveCardAliasRef = useRef(null);
    const [registerCardCheckBox, setRegisterCardCheckBox] = useState("0");
    const [isChecked3DCard, setChecked3DCard] = useState(false);


    const [userInfo, setUserInfo] = useState([]);
    const shoppingOrderMain = useSelector(state => state.shoppingOrder)
    const [monthText, setMonthText] = useState("");
    const [month, setMonth] = useState([]);
    const [yearText, setYearText] = useState("");
    const [year, setYear] = useState([]);

    const [isCardInValid, setIsCardInValid] = useState(false);
    const [isCardHolderName, setIsCardHolderName] = useState(false);
    const [isCardCvv, setIsCardCvv] = useState(false);
    const [isCardAlias, setIsCardAlias] = useState(false);


    const cardRef = useRef("");
    const holderNameRef = useRef("");
    const cvvRef = useRef("");

    useEffect(() => {
        const getUser = async () => {
            const queryParams = `userId=${userId}`;
            const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-shopping-cart/${queryParams}`;
            const res = await axios.get(url);
            setUserInfo(() => [res.data.products, res.data.userId, res.data.shoppingCartId, res.data.currency]);
            dispatch(cartActions.reset());
            res.data.products.map((item, index) => {
                const {product, ...rest} = item;
                dispatch(cartIndexActions.addToCartIndex());
                dispatch(cartActions.addProduct({...product, ...rest, addIndex: index}))
            })
        }
        getUser()
    }, [userId])


    useEffect(() => {
        setMonth([]);
        setYear([]);
        const getMonth = async () => {
            dataMonth.data.forEach((item) => {
                const key = Object.keys(item)[0];
                const value = item[key];
                setMonth((prev) => [...prev, {key: key, value: value}]);
            });
        }

        const getYear = async () => {
            dataYear.data.forEach((item) => {
                const key = Object.keys(item)[0];
                const value = item[key];
                setYear((prev) => [...prev, {key: key, value: value}]);
            });
        }
        getMonth();
        getYear();
    }, [])

    // const handleOnSubmit = async () => {
    //     const cardNumber = cardRef.current?.value;
    //     const cardHolderName = holderNameRef.current?.value;
    //     const cardCvv = cvvRef.current?.value;
    //     const cardAlias = saveCardAliasRef.current?.value;
    //     cardCvv === "" ? setIsCardCvv(true) : setIsCardCvv(false)
    //     cardHolderName === "" ? setIsCardHolderName(true) : setIsCardHolderName(false)
    //     if (isCheckedSaveCard) {
    //         cardAlias === "" ? setIsCardAlias(true) : setIsCardAlias(false)
    //     }
    //
    //
    //     const shoppingOrder = shoppingOrderMain.shoppingOrder;
    //
    //     const e_invoice = shoppingOrder[0].e_invoice;
    //     const cargoAddress = shoppingOrder[0].cargoAddress;
    //
    //     if (checkOutPaymentMethod === 0) {
    //
    //         const notSelectCard = {
    //             products: userInfo[0],
    //             userId: userInfo[1],
    //             shoppingCartId: userInfo[2],
    //             currency: userInfo[3],
    //             e_invoice,
    //             cargoAddress,
    //             total: cart.total,
    //             totalQuantity: cart.totalQuantity,
    //             cardHolderName,
    //             expireYear: yearText,
    //             expireMonth: monthText,
    //             cardNumber,
    //             cvc: cardCvv,
    //             registerCard: registerCardCheckBox,
    //             isSave: false
    //         };
    //         if (registerCardCheckBox === "1") {
    //             const cardAlias = saveCardAliasRef.current.value;
    //             notSelectCard.cardAlias = cardAlias;
    //             console.log("registerCard", notSelectCard)
    //         }
    //
    //         try {
    //
    //             let url;
    //             if (isChecked3DCard) {
    //                 url = `${process.env.NEXT_PUBLIC_API_URL}/payment_threeds/payments/cart-addPayment`
    //
    //             } else {
    //                 url = `${process.env.NEXT_PUBLIC_API_URL}/payment/cart-addPayment`
    //
    //             }
    //
    //             if (url !== null) {
    //                 const res = await axios.post(url, notSelectCard)
    //                 if (res.status === 200) {
    //                     setIsCardInValid(false);
    //                     dispatch(cartActions.reset())
    //                 }
    //
    //             }
    //
    //         } catch (err) {
    //             if (err.response.data.message.trim() === "Kart numarası geçersizdir") {
    //                 setIsCardInValid(true);
    //             }
    //             console.log("err", err)
    //
    //         }
    //     }
    //     if(checkOutPaymentMethod===1) {
    //
    //         const selectCardOrder = {
    //             products: userInfo[0],
    //             userId: userInfo[1],
    //             shoppingCartId: userInfo[2],
    //             currency: userInfo[3],
    //             e_invoice,
    //             cargoAddress,
    //             total: cart.total,
    //             totalQuantity: cart.totalQuantity,
    //             isSave: true
    //         };
    //
    //         try {
    //             const queryParams = `cardIndex=${selectCard}`;
    //             let url;
    //             if (isChecked3DCard) {
    //                 url = `${process.env.NEXT_PUBLIC_API_URL}/payment_threeds/payments/cart-addPayment?${queryParams}`
    //             } else {
    //
    //                 url = `${process.env.NEXT_PUBLIC_API_URL}/payment/cart-addPayment?${queryParams}`
    //             }
    //             if (url !== null) {
    //                 const res = await axios.post(url, selectCardOrder)
    //                 if (res.status === 200) {
    //                     dispatch(cartActions.reset())
    //                     dispatch(ShoppingOrderActions.deleteShoppingOrder())
    //
    //                 }
    //                 console.log("Res", res)
    //
    //             }
    //
    //         } catch (err) {
    //             console.log("Res", err)
    //
    //         }
    //     }
    //
    // }


    const handleOnSubmit = () => {
        setCheckOutPaymentInformation(false)
        setCheckOutLastStepInformation(true);
        setCompleteCheckout(true)
    }

    const handleChangeSaveCard = (event) => {
        setCheckedSaveCard(event.target.checked);
        !isCheckedSaveCard ? setRegisterCardCheckBox("1") : setRegisterCardCheckBox("0")
    };
    const handleChange3DCard = (event) => {
        setChecked3DCard(event.target.checked);
    };
    const handlePaymentWithIyzico = async () => {

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
            totalQuantity: cart.totalQuantity,
            isSave: true
        };
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/checkout/payments/cart-addPayment`
            if (userInfo) {
                const res = await axios.post(url, selectCardOrder)
            }
            console.log("RES________________", res.data)
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        if (userInfo[1]) {
            const getCardList = async () => {

                if (userInfo[1]?.cardUserKey) {
                    try {
                        const queryParams = `userId=${session?.user?.id}`;
                        const url = `${process.env.NEXT_PUBLIC_API_URL}/payment/cart-list?${queryParams}`
                        const res = await axios.get(url);
                        setCardList(res?.data?.data)
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
            getCardList();
        }
    }, [userInfo])

    const checkOutPaymentInformation = ["Kredi Kartı", "Kayıtlı Kart ile Öde", "iyzico ile Öde"];

    const onClickPaymentInformation = (index) => {
        setCheckOutPaymentMethod(index)
    }


    return <>
        <div className="flex flex-row items-center justify-center w-full font-workSans">
            {checkOutPaymentInformation.map((item, index) => {
                return <div key={item} className=" w-full  lg:pt-5 p-1  cursor-pointer"
                            onClick={() => onClickPaymentInformation(index)}>
                    <div className="w-full flex items-center justify-center gap-2">
                        <span>
                                 {(checkOutPaymentMethod === index) ? (
                                         <>
                                             <AiFillCheckCircle
                                                 className="text-primaryBold text-xl lg:hidden lg:w-4 lg:h-4 h-4 w-4"/>
                                             <AiOutlineCheckCircle
                                                 className="text-primaryBold text-xl lg:block hidden  h-4 w-4"/>
                                         </>)
                                     : (<RxCircle className="text-payneGray text-xl  h-4 w-4"/>)}
                        </span>
                        <span
                            className="lg:font-semibold lg:text-base md:font-semibold md:text-sm font-semibold text-sm">{item}</span>
                    </div>
                </div>
            })}
        </div>


        {checkOutPaymentMethod === 0 && (<div className="px-4 ">
            <div className="w-full flex  gap-4 ">

                <div className="lg:basis-1/2 w-full">
                    <div className="flex flex-col w-full  ">
                        <div className="flex gap-5 flex-col  w-full">
                            <div
                                className={`flex flex-col gap-4 p-4  rounded-xl text-cadetGray text-sm text-red-500 font-light`}>
                                <>
                                    {isCardInValid && (cardRef.current?.value === "" ? (
                                        <p>Kart Numarası Giriniz</p>) : (<p>Yanlış Kart Numarası</p>))}
                                    {monthText === "Ay" &&
                                        <p>Son Kullanma Tarihi Ay Bilgisini Seçiniz</p>}
                                    {yearText === "Year" &&
                                        <p>Son Kullanma Tarihi Yıl Bilgisini Giriniz</p>}
                                    {isCardHolderName && <p>Hattalı Kart Sahibi Adı</p>}
                                    {isCardCvv && (cvvRef.current?.value?.length > 0 && cvvRef?.current.value?.length < 3 ? (
                                        <p>Hatalı CVV</p>) : (<p> CVV Numarası Giriniz</p>))}
                                    {isCardAlias && <p>Kart ismi giriniz</p>}
                                </>
                            </div>

                            <span className="text-sm mb-[-1rem]">Kart Numarası</span>
                            <input type="text"
                                   name="cardNumber"
                                   maxLength={16}
                                   className="outline-none py-3 px-4 border-cadetGray border-[1.1px] rounded-lg"
                                   ref={cardRef}
                            />
                            <span className="text-sm mb-[-1rem]">Kart Sahibinin Adı</span>
                            <input type="text"
                                   name="cardHolderName"
                                   maxLength={16}
                                   className="outline-none py-3 px-4 border-cadetGray border-[1.1px] rounded-lg"
                                   ref={holderNameRef}
                            />

                            <div className="flex items-end justify-between mb-[-1rem]">
                                <span className="text-sm">Son Kullanma Tarihi</span>
                                <span className="text-sm">CVV</span>
                            </div>
                            <div className="flex items-start justify-between w-full gap-4">

                                <div className="basis-1/3">
                                    <select id="select"
                                            value={monthText}
                                            onChange={(e) => setMonthText(e.target.value)}
                                            className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-opacity-50 shadow-2xl shadow-cadetGray"

                                    >
                                        <option key={1} value="Ay">Ay</option>
                                        {month.map((option) => (<option key={option.key} value={option.value}>
                                            {option.value}
                                        </option>))}
                                    </select>

                                </div>
                                <div className="basis-1/3 ">
                                    <select id="select"
                                            value={yearText}
                                            onChange={(e) => setYearText(e.target.value)}
                                            className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-opacity-50 shadow-2xl shadow-cadetGray"

                                    >
                                        <option key={1} value="Year">Year</option>
                                        {year.map((option) => (<option key={option.key} value={option.value}>
                                            {option.value}
                                        </option>))}
                                    </select>

                                </div>
                                <div className="basis-1/3">
                                    <input type="text"
                                           name="cardHolderName"
                                           maxLength={3}
                                           className="outline-none py-3 px-4 border-cadetGray border-[1.1px] rounded-lg w-full"
                                           ref={cvvRef}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>

            {!showSaveCardList && <div className="flex gap-4 items-center mt-5">
                <input type="checkbox" checked={isCheckedSaveCard} onChange={handleChangeSaveCard}
                       value={isCheckedSaveCard ? 1 : 0} className="w-4 h-4 align-top"/>
                <span className="align-text-bottom">Kartımı Kaydet</span>
            </div>}
            <div className="flex gap-4 items-center mt-5">
                <input type="checkbox" checked={isChecked3DCard} onChange={handleChange3DCard}
                       value={isChecked3DCard ? 1 : 0} className="w-4 h-4 align-top"/>
                <span className="align-text-bottom">3D ile ödeme Yap</span>
            </div>
            {isCheckedSaveCard && (<div className="w-full">
                <input type="text"
                       name="saveCardAlias"
                       placeholder="Kart ismi giriniz."
                       required={true}
                       className="outline-none py-3 px-4 border-primary border-[1.1px] rounded-lg"
                       ref={saveCardAliasRef}
                />
            </div>)}

        </div>)}
        {checkOutPaymentMethod === 1 && (<div className="px-4">

            <div className="flex gap-4 flex-col w-full  py-2 mt-4 ">
                {(cardList.length > 0 ? (<select id="select"
                                                 value={selectCard}
                                                 onChange={(e) => setSelectCard(e.target.value)}
                                                 className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none
                       focus:ring-opacity-50 shadow-2xl shadow-cadetGray"
                >
                    {cardList.map((option, index) => (<option key={index} value={index} className="p-4">
                        {`${option.cardAlias} ${option.cardAssociation} ${option.lastFourDigits}`}
                    </option>))}
                </select>) : (<div className="flex justify-center w-full text-lg">Henüz Kayıtlı bir Kartınız
                    yok</div>))}

            </div>
            <div className="flex gap-4 items-center mt-5">
                <input type="checkbox" checked={isChecked3DCard} onChange={handleChange3DCard}
                       value={isChecked3DCard ? 1 : 0} className="w-4 h-4 align-top"/>
                <span className="align-text-bottom">3D ile ödeme Yap</span>
            </div>
        </div>)}
        {checkOutPaymentMethod === 2 && (<>
            <div className="w-full flex flex-col mt-4  py-2 px-4 bg-transparent font-medium"
                 onClick={handlePaymentWithIyzico}>
                <div className="flex md:items-end items-center gap-4 font-light">
                    <Image src="/images/iyzico.png"
                           alt={"/images/iyzico.png"}
                           width={150}
                           height={100}
                           priority={true}
                           className="md:w-[9rem] md:h-[3rem] w-[100px] h-[75px]]"
                    />
                    <p className="leading-6 text-left tracking-wide lg:text-payneGray text-stateGray lg:text-base text-sm">iyzico
                        ile Hızlı ve Kolay Alışveriş!</p>
                </div>
                <div
                    className="bg-iyzicoBg mt-2 p-4  leading-6 text-left tracking-wider lg:text-payneGray text-stateGray lg:text-base text-sm">

                    <span className="pr-2 whitespace-pre-wrap w-full">Ödemenizi iyzico ile tamamlamak üzere “Ödemeyi Tamamla” butonuna tıkladığınızda farklı bir pencereye yönlendirileceksiniz.</span>
                    <br/>
                    <span> Alışverişini ister iyzico bakiyenden, ister saklı kredi kartın yada Havale/EFT yöntemi ile kolayca ve güvenle öde; aklına takılan herhangi bir konuda iyzico Korumalı Alışveriş avantajıyla iletişime geç, 7/24 canlı destek al.
            </span>

                </div>
            </div>
        </>)}
        <div className="flex items-center lg:justify-end w-full px-4  my-4">
            <div className="lg:basis-[45%] w-full flex items-center justify-center  py-2.5 bg-primary hover:bg-primaryBold
             text-tertiary uppercase rounded-lg cursor-pointer"
                 onClick={() => handleOnSubmit()}
            >Ödemeyi Tamamla
            </div>
        </div>

    </>

}
export default CheckOutInformation;