
import React, {useEffect, useRef, useState} from "react";
import dataMonth from "../../libs/countryData/month.json"
import dataYear from "../../libs/countryData/year.json"
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import {useSelector} from "react-redux";
let lookup = require('binlookup')()

const CheckOutInformation = ({userId,isLoading,setIsLoading,setCheckOutPaymentInformation,setCheckOutLastStep})=>{
    const cart =useSelector(state=>state.cart)
    const [userInfo,setUserInfo]=useState([]);
    const shoppingOrderMain=useSelector(state=>state.shoppingOrder)
    const [monthText,setMonthText]=useState( "");
    const [month,setMonth]=useState([]);
    const [yearText,setYearText]=useState( "");
    const [year,setYear]=useState([]);

    const [isCardInValid,setIsCardInValid]=useState(false);
    const [isCardHolderName,setIsCardHolderName]=useState(false);
    const [isCardCvv,setIsCardCvv]=useState(false);
    const [lookData,setLookData]=useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [checkBoxChecked,setCheckBoxChecked]=useState("");
    const cardRef=useRef("");
    const holderNameRef=useRef("");
    const cvvRef=useRef("");

    useEffect(()=>{
        const getUser= async ()=>{
            const queryParams = `userId=${userId}`;
            const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-shopping-cart/${queryParams}`;
            const res =await axios.get(url);
            setUserInfo(()=>[res.data.products,res.data.userId]);

        }
        getUser()
    },[])

    useEffect(()=>{
        setMonth([]);
        setYear([]);
        const getMonth= async ()=>{
            dataMonth.data.forEach((item) => {
                const key = Object.keys(item)[0];
                const value = item[key];
                setMonth((prev) => [...prev, { key: key, value: value }]);
            });
        }

        const getYear= async ()=>{
            dataYear.data.forEach((item) => {
                const key = Object.keys(item)[0];
                const value = item[key];
                setYear((prev) => [...prev, { key: key, value: value }]);
            });
        }
        getMonth();
        getYear();
    },[])

    // lookup('5528790000000008', function( err, data ){
    //     if (err)
    //         return console.error(err)
    //
    //     console.log(data)
    // })
    //
    // useEffect(()=>{
    //     lookup(`${cardRef.current.value}`, function( err, data ){
    //         if (err){
    //             return setIsCardInValid(true)
    //         }
    //         setIsCardInValid(false)
    //         setLookData({...data})
    //     });
    // },[cardRef.current.value])

   const handleOnSubmit= async ()=>{
        const cardNumber=cardRef.current.value;
        const cardHolderName=holderNameRef.current.value;
        const cardCvv=cvvRef.current.value;

        cardCvv === "" ? setIsCardCvv(true) : setIsCardCvv(false)
       cardHolderName === "" ? setIsCardHolderName(true) : setIsCardHolderName(false)

    if(isCardInValid === false){
        const orderNo=uuidv4();
        const shoppingOrder = shoppingOrderMain.shoppingOrder;


        const e_invoice = shoppingOrder[0].e_invoice;
        const cargoAddress = shoppingOrder[0].cargoAddress;
        const order={
            products:userInfo[0],
            userId:userInfo[1],
            e_invoice,
            cargoAddress,
            orderNo,
            total:cart.total,
            totalQuantity:cart.totalQuantity,
            cardHolderName,
            expireYear:yearText,
            expireMonth:monthText,
            cardNumber,
            cvc:cardCvv,
            registerCard: checkBoxChecked,
            isSave:false
        };

        console.log(order);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment/payment-cart-addPayment`,order)
            console.log("RES?___",res.data)
        }catch (err){
            console.log(err);
        }

    }
   }
    const handleChange = (event) => {
        setIsChecked(event.target.checked);
        !isChecked ? setCheckBoxChecked("1"):setCheckBoxChecked("0")
    };

    return <>
        <div className="flex w-full">
            <div className="flex gap-5 flex-col basis-1/2 w-full mt-10">

                {isCardInValid  && <p className="text-danger text-sm">Yanlış Kart Numarası</p>}
                {monthText === "Ay" && <p className="text-danger text-sm">Son Kullanma Tarihi Ay Bilgisini Seçiniz</p>}
                {yearText === "Year" && <p className="text-danger text-sm">Son Kullanma Tarihi Yıl Bilgisini Giriniz</p>}
                {isCardHolderName  && <p className="text-danger text-sm">Kart sahibinin adı giriniz</p>}
                {isCardCvv && <p className="text-danger text-sm">Yanlış CVV</p>}

                <span className="text-sm mb-[-1rem]">Kart Numarası</span>
                <input type="text"
                       name="cardNumber"
                       maxLength={16}
                       className="outline-none py-3 px-4 border-primary border-[1.1px] rounded-lg"
                       ref={cardRef}
                />
                <span className="text-sm mb-[-1rem]">Kart Sahibinin Adı</span>
                <input type="text"
                       name="cardHolderName"
                       maxLength={16}
                       className="outline-none py-3 px-4 border-primary border-[1.1px] rounded-lg"
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
                                        onChange={(e)=>setMonthText(e.target.value)}
                                        className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-opacity-50 shadow-2xl shadow-primary"

                        >
                            <option key={1} value="Ay">Ay</option>
                            {month.map((option) => (
                                <option key={option.key} value={option.value}>
                                    {option.value}
                                </option>
                            ))}
                        </select>

                        </div>
                    <div className="basis-1/3 ">
                        <select id="select"
                                    value={yearText}
                                    onChange={(e)=>setYearText(e.target.value)}
                                    className="block w-full p-4 bg-gray border-gray-300 rounded-md shadow-sm focus:outline-none
                                  focus:ring-opacity-50 shadow-2xl shadow-primary"

                    >
                        <option key={1} value="Year">Year</option>
                        {year.map((option) => (
                            <option key={option.key} value={option.value}>
                                {option.value}
                            </option>
                        ))}
                    </select>

                    </div>
                    <div className="basis-1/3">
                        <input type="text"
                               name="cardHolderName"
                               maxLength={3}
                               className="outline-none py-3 px-4 border-primary border-[1.1px] rounded-lg w-full"
                                 ref={cvvRef}
                        />
                    </div>
                </div>

            </div>
        </div>
        <div>
            <input type="checkbox" checked={isChecked} onChange={handleChange} value={isChecked ? 1 : 0} />
        </div>
        <div className="flex items-center justify-end w-full mt-6">
            <div className="basis-1/2 flex items-center justify-center py-2 bg-primary hover:bg-primaryBold
             text-tertiary uppercase rounded-lg cursor-pointer"
            onClick={()=>handleOnSubmit()}
            >Ödemeyi planla</div>
        </div>
    </>

}
export default CheckOutInformation;