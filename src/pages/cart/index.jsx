import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";

import {useSelector, useDispatch} from "react-redux";
import {cartActions} from "../../redux/cartSlice";
import {ProductExtrasActions} from "../../redux/ProductExtras";
import axios from "axios";
import {useSession} from "next-auth/react";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import Router from "next/router";
import Link from "next/link";
import {BiRightArrowAlt} from "react-icons/bi";

const Cart = ({userList}) => {

    const {data: session} = useSession();
    //const productExtras=useSelector((state)=>state.productExtras);
    const dispatch = useDispatch();
    const router = useRouter();
    let cart = useSelector(state => state.cart);
    const user = userList?.find((user) => user.email === session?.user?.email);
    const [cartProduct, setCartProduct] = useState([]);
    const [mobileShowBasketDetail,setMobileShowBasketDetail] =useState(false)
    const [shippingCost, setShippingCost] = ("");
    const [showCouponCode, setShowCouponCode] = useState(false);
    const [textCouponCode, setTextCouponCode] = useState("");
    const scrollRef=useRef(null);

    const cartProducts = () => cart.products.forEach((item) => {
        const products = {
            image: item.image,
            title: item.title,
            extras: item.extras,
            price: item.price,
            quantity: item.productTotal,
            orderId: item._id,
        };
        console.log()
        setCartProduct((prev) => [...prev, products]);
    });


    useEffect(() => {
        cartProducts();
    }, [cart.products.length])

    const newOrder = {
        email: user?.email,
        customer: user?.fullName,
        address: user?.address ? user?.address : "No address",
        quantity: cart.totalQuantity,
        total: cart.total,
        method: 0,
        productOrder: cartProduct,

    }

    const createOrder = async () => {
        try {
            if (session) {
                if (confirm("Are you sure to order?")) {
                    if (newOrder.address === 'No address') {
                        await router.push(`/profile/${user._id}`)
                        throw new Error('Define User address.');

                    }
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, newOrder);
                    if (res.status === 201) {
                        dispatch(cartActions.reset())
                        toast.success("Order created successfully", {autoClose: 1000});
                        await router.push(`/order/${res.data._id}`);

                    }
                }
            } else {
                throw new Error('Please login first');

            }
        } catch (err) {
            toast.error(`${err.message}`, {autoClose: 1000})
            setTimeout(() => {
                router.push("/auth/login");
            }, 700);
            console.log(err);
        }
    }

    const increaseItemHandler = (item) => {
        dispatch(cartActions.increaseProduct(item));

    }
    const decreaseItemHandler = (item) => {
        dispatch(cartActions.decreaseProduct(item));

    }
    const removeItemHandler = (item) => {
        dispatch(cartActions.removeProduct(item));

    }

    const productPageHandler = (product) => {

        const name = "productPage";
        dispatch(ProductExtrasActions.addToExtrasswithRedux(product));
        Router.push({
            pathname: "/product/" + product._id.toString(), query: {name},
        })

    }
    const ApplyCouponCode = () => {
        console.log(textCouponCode)
    }




    return <div className={`min-h-[calc(100vh_-_433px)] font-workSans `}>
        <div className="flex justify-between  md:flex-row flex-col m-auto  max-w-[70rem]">
                <div className={`basis-[68%] py-4 px-4  ${mobileShowBasketDetail ? 
                    "after:content[''] after:absolute after:top-0 after:left-0 after:bg-[#212529] after:w-full after:h-full after:opacity-70 after:z-20" : ""} `}
                     onClick={()=>{mobileShowBasketDetail && setMobileShowBasketDetail(!mobileShowBasketDetail)}}
                     ref={scrollRef}>
                    <div className="flex items-end justify-between pt-1 pb-4 mb-4 border-b-2">
                        <p className="text-[1.406rem] md:font-semibold font-base">Alışveriş Sepeti</p>
                        <Link href="/menu" className="hover:underline text-[0.875rem] mr-4 md:block hidden">Alışverişe Devam
                            Et</Link>
                    </div>
                    {cart.products.map((product, index) => {
                        return <div key={index}
                                    className="flex items-start h-[11.375rem] mt-4 border-secondary border-b-[1px] border-opacity-40">

                            <Image src="/images/f1.png"
                                   alt="/images/f1.png"
                                   className="w-auto h-auto md:pr-4 pr-1 md:basis-[23.49%]"
                                   width={100}
                                   height={100}
                                   priority={true}
                            />
                            <div className="flex md:flex-row flex-col w-full h-full md:static relative">
                                <div
                                    className="flex flex-col  items-start text-xs font-semibold font-workSans text-cadetGray ml-2 md:w-full w-[8.5rem]  top-2 md:basis-[43.635%]">
                                    <p className="text-base font-semibold text-secondary md:mb-0 mb-1 md:w-full ">{product.title}</p>
                                    <p className="text-cadetGray md:mb-0 mb-1">
                                    <span
                                        className="text-stateGray font-workSans font-semibold md:w-full max-w-[8.5rem]">
                                        {product.extras.length > 0 ? "Options:" : ""}</span>
                                        {product.extras.map(ext => ext.text).join(', ')}
                                    </p>
                                    <p className="capitalize md:mb-0 mb-2">Category: {product.category}</p>
                                </div>
                                <div
                                    className="flex flex-col md:flex-row md:gap-0 gap-2 items-start md:h-full w-full justify-between md:basis-[56.365%] md:mr-2 md:mt-0 mt-2">
                                    <div
                                        className="flex flex-row  items-center justify-center gap-4 ml-0 md:ml-[5.125rem]">
                                        <button
                                            className="border-[1px] border-secondary w-5 h-5 rounded-full text-md flex items-center justify-center"
                                            onClick={() => increaseItemHandler(product)}
                                        >+
                                        </button>
                                        <p>{product.productTotal}</p>
                                        <button
                                            className="border-[1px] border-secondary w-5 h-5 rounded-full text-md flex items-center justify-center"
                                            onClick={() => decreaseItemHandler(product)}
                                        >-
                                        </button>

                                    </div>

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
                                                }).format((product.price * product.productTotal))}₺
                                            </span>
                                        </div>
                                        <div
                                            className=" flex w-full justify-end mr-2 mb-2  md:hover:text-danger   cursor-pointer
                                                  md:static md:top-0 md:right-0 md:text-lg md:text-secondary  absolute top-2  text-2xl text-stateGray
                                        "
                                            onClick={() => removeItemHandler(product)}>
                                            <i className="fa-solid fa-trash-can"></i>
                                            <span className="md:hidden block text-lg ml-[1px]">Sil</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    })}

                </div>


            <div className={` basis-[32%] flex items-center justify-center md:block hidden`}>
                <div className={`h-[11.255rem] w-full border-[1.11px] font-medium  rounded-tr-lg rounded-tl-lg  `}>
                    <div className="p-[0.938rem]">
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
                            <div className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] pb-2 border-b-[1.11px] ">
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
                    <div className="border-l-[1.11px]  border-r-[1.11px] border-b-[1.11px] rounded-br-lg rounded-bl-lg  w-full">
                        <div className="flex items-center justify-center flex-col w-full ">
                            <div className="text-xs underline p-[0.938rem] font-bold "
                                 onClick={() => setShowCouponCode(!showCouponCode)}>Kupon Kodu Kullan
                            </div>
                            {showCouponCode && <div className="pb-4">
                                <input
                                    type="text"
                                    placeholder="Kupon Kodu"
                                    className="p-3 rounded-tl-xl rounded-bl-xl border-[1px] outline-none"
                                    onChange={(e) => setTextCouponCode(e.target.value)}
                                />
                                <button
                                    className=" h-full text-primary px-5 py-3.5 border-[1.11px] border-primary rounded-tr-xl rounded-br-xl "
                                    onClick={ApplyCouponCode}
                                >
                                    <span
                                        className="flex items-center justify-center gap-1 uppercase text-sm">Kullan <BiRightArrowAlt/></span>
                                </button>

                            </div>}
                        </div>
                    </div>
                    <button className="w-full p-2 bg-primary text-tertiary rounded-lg mt-2"
                            onClick={createOrder}
                    >Siparişi Tamamla</button>
                </div>
            </div>
            <div className={`fixed bottom-0 bg-primary p-6 w-full md:hidden block ${mobileShowBasketDetail ? "z-50" : ""}
                
            `}>
                <div>
                    <div className="flex items-center justify-between flex-row  font-semibold">
                        <div className={`flex item-center justify-center gap-2 ${mobileShowBasketDetail ? "mb-3" : "mb-[0.5rem]"} `}>
                            <span className="place-self-start" onClick={()=>setMobileShowBasketDetail(!mobileShowBasketDetail)}>
                                {mobileShowBasketDetail ? (<i className="fa-solid fa-chevron-down fa-xs"></i>): (
                                    <i className="fa-sharp fa-solid fa-angle-up fa-xs"></i>)}
                            </span>
                            <span>Toplam</span>
                        </div>
                        <div >{cart.total}.00TL</div>
                    </div>
                    {mobileShowBasketDetail && <>
                        <div className="  border-t-2  ">
                            <div className="flex  flex-row items-center justify-between mt-5">
                                <span>Ara Toplam</span>
                                <span>{cart.total}.00TL</span>
                            </div>
                        </div>
                        <div className=" flex items-center justify-between mt-2 flex-row  ">
                            <span>Kargo Ücreti</span>
                            <span>Ücretsiz Kargo</span>
                        </div></>}
                        <button className="w-full p-2 bg-tertiary text-secondary  mt-3 uppercase text-sm font-semibold"
                                onClick={createOrder}
                        >
                          Sepeti onayla
                        </button>
                </div>
            </div>
        </div>
    </div>
}
export const getServerSideProps = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    return {
        props: {
            userList: res.data ? res.data : [],
        }
    }
}
export default Cart;