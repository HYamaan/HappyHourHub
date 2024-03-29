import React, {useEffect, useState} from "react";
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
import {BsShieldFillCheck} from "react-icons/bs";
import {HiOutlineXMark} from "react-icons/hi2";
import CartMenuItem from "../../components/cart/cartMenuItem";

const Cart = ({ productList}) => {

    const {data: session} = useSession();
    const dispatch = useDispatch();
    const router = useRouter();
    let cart = useSelector(state => state.cart);

    const [mobileShowBasketDetail, setMobileShowBasketDetail] = useState(false)
    const [showCouponCode, setShowCouponCode] = useState(false);
    const [textCouponCode, setTextCouponCode] = useState(cart?.couponCart?.couponText || "");
    const [isCouponCode, setIsCouponCode] = useState(false);
    const [couponCodePrice, setCouponCodePrice] = useState(0);
    const [couponCodeId, setCouponCodeId] = useState("");


    const [isHandleClick, setIsHandleClick] = useState(false);
    const [isUpdateClick, setIsUpdateClick] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [updateProduct, setUpdateProduct] = useState({});
    const [cargoPrice, setCargoPrice] = useState( 0);
    const [menuItemClickForCart, setMenuItemClickForCart] = useState(false);
    const [isLoading,setIsLoading]=useState(false);
    console.log("Cart",cart)

    useEffect(() => {
        if (cart.total < 1000) {

            if (cargoPrice === 0) {
                const cargoPrice2 = 19;
                setCargoPrice(cargoPrice2);
                dispatch(cartActions.addCargoPrice(cargoPrice2));
            }
        } else {
            if (cargoPrice !== 0) {
                dispatch(cartActions.removeCargoPrice(cargoPrice));
                setCargoPrice(0);
            }
        }
        if(cart.totalQuantity === 0){
            dispatch(cartActions.removeCargoPrice(cargoPrice));
            setCargoPrice(0);
        }

    }, [cart.total, menuItemClickForCart, isUpdateClick, deleteProduct,cart.totalQuantity]);


    const increaseItemHandler = (item) => {
        setIsUpdateClick(!isUpdateClick)
        setUpdateProduct({
            data: {
                _id: item._id,
                productTotal: item.productTotal + 1
            }
        });
        dispatch(cartActions.increaseProduct(item));

    }
    const decreaseItemHandler = (item) => {
        setIsUpdateClick(!isUpdateClick)
        setUpdateProduct({
            data: {
                _id: item._id,
                productTotal: item.productTotal - 1
            }
        });
        dispatch(cartActions.decreaseProduct(item));
        if (cart.totalQuantity === 1) {
            dispatch(cartActions.removeCouponId(cart.couponCart.couponAmount));
            dispatch(cartActions.resetOther());
            setShowCouponCode(false)
            setIsCouponCode(false);
            setTextCouponCode("");
            setCouponCodePrice(0);

        }
    }
    const removeItemHandler = (item) => {
        setIsHandleClick(true)
        setDeleteProduct(item);
        dispatch(cartActions.removeProduct(item));
        if (cart.totalQuantity === 1) {
            dispatch(cartActions.removeCouponId(cart.couponCart.couponAmount));
            dispatch(cartActions.resetOther());
            setShowCouponCode(false);
            setIsCouponCode(false);
            setTextCouponCode("");
            setCouponCodePrice(0);

        }

    }

    const productPageHandler = (product) => {

        const name = "productPage";
        dispatch(ProductExtrasActions.addToExtrasswithRedux(product));
        Router.push({
            pathname: "/product/" + product._id.toString(), query: {name},
        })
    }
    const ApplyCouponCode = async () => {

        try {
            if (textCouponCode) {

                const searchCoupon = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/couponCode/search-coupon-code`,
                    {couponCode: textCouponCode})
                console.log("carts", cart)

                if (searchCoupon?.data?.success) {
                    if (couponCodePrice === 0) {
                        if (searchCoupon.data?.productId) {
                            const findProduct = cart.products.find(item => item._id === searchCoupon.data.productId._id);
                            dispatch(cartActions.setCouponId({
                                couponAmount: findProduct.price,
                                couponId: searchCoupon.data?.couponId,
                                couponText: searchCoupon.data?.code
                            }))
                        } else {
                            dispatch(cartActions.setCouponId({
                                couponAmount: searchCoupon.data?.discountAmount,
                                couponId: searchCoupon.data?.couponId,
                                couponText: searchCoupon.data?.code
                            }))
                        }

                    }
                    setCouponCodePrice(searchCoupon.data.discountAmount)
                    setCouponCodeId(searchCoupon.data.couponId)
                    setIsCouponCode(true)
                } else {
                    if (couponCodePrice !== 0) {
                        dispatch(cartActions.removeCouponId(couponCodePrice));
                        setCouponCodePrice(0)
                    }
                    setIsCouponCode(false)
                }

            }
        } catch (err) {
            if (couponCodePrice !== 0) {
                dispatch(cartActions.removeCouponId(couponCodePrice));
                setCouponCodePrice(0)
            }
            toast.error(err.response.data.message)
            setIsCouponCode(false)
            console.log(err);
        }
    }
    const routeCheckoutPage = async () => {
        if (session?.user) {
            try {
                //Update Kargo Price FOR DB

                let queryParams = "";
                const couponPriceQuery = `${couponCodePrice !== 0 && `couponPrice=${couponCodePrice}&couponId=${couponCodeId}`}`;
                const cargoPriceQuery = `${cargoPrice !== 0 && `kargoPrice=${cargoPrice}`}`
                if (cargoPrice !== 0 && couponCodePrice === 0) {
                    queryParams = `userId=${session?.user?.id}?${cargoPriceQuery}`;
                } else if (couponCodePrice !== 0 && cargoPrice === 0) {
                    queryParams = `userId=${session?.user?.id}?${couponPriceQuery}`;
                } else if (couponCodePrice !== 0 && cargoPrice !== 0) {
                    queryParams = `userId=${session?.user?.id}?${cargoPriceQuery}&${couponPriceQuery}`;
                } else {
                    queryParams = `userId=${session?.user?.id}?delete-cargo-couponPrice`
                }
                const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-shopping-cart/${queryParams}`;
                console.log("url", url)
                if (session?.user) {
                    await axios.patch(url);
                }

                await router.push('/checkout/opc');
            } catch (err) {
                console.log(err);
            }
        } else {
            await router.push('/auth/login');
            toast.warn("Please login first")
        }
    }
    //DELETE PRODUCT FOR DB
    useEffect(() => {
        const DBtoReduxCart = async () => {
            setTimeout(async () => {
                if (isHandleClick && deleteProduct) {
                    setIsHandleClick(false);
                    try {
                        setIsLoading(true);
                        const queryParams = `userId=${session?.user?.id}`;
                        const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-shopping-cart/${queryParams}`;
                        if (session?.user) {

                           const res =  await axios.delete(url, {data: {sku: deleteProduct.sku}});
                            if(res.status===200){
                                setIsLoading(false);
                            }
                        }

                    } catch (err) {
                        setIsLoading(false);
                        console.log(err.message)
                    }
                }
            }, 5);
        };

        DBtoReduxCart();
    }, [isHandleClick, deleteProduct, session?.user])

    //UPDATE PRODUCT FOR DB
    useEffect(() => {

        const DBtoReduxCart = async () => {

            setTimeout(async () => {
                if (updateProduct) {
                        setIsLoading(true);
                    try {
                        console.log("update",updateProduct)
                        const queryParams = `userId=${session?.user?.id}?updateProductTotal=${updateProduct.data.productTotal}&productId=${updateProduct.data._id}`;
                        const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-shopping-cart/${queryParams}`;
                        if (session?.user) {
                            console.log("update",url)
                           const res = await axios.patch(url);
                           if (res.status===200){
                               setIsLoading(false);
                           }

                        }

                    } catch (err) {
                        setIsLoading(false);
                        console.log(err.message)
                    }
                }
            }, 5);
        };

        DBtoReduxCart();
    }, [isUpdateClick, updateProduct, session?.user])


    const noProductInBasket = async () => {
        await router.push("/menu");
    }

    return <div className={`m-auto  max-w-[70rem] ${mobileShowBasketDetail ?
        "after:content[''] after:absolute after:top-0 after:left-0 after:bg-[#212529] " +
        "after:w-full after:h-full after:opacity-70 after:z-40" : ""}`}>
        <div
            className={` ${cart.products.length === 0 ? "min-h-[calc(10vh)]" : `min-h-[calc(100vh_-_${190.89*cart.products.length}px)]`} font-workSans w-full h-full relative mb-14`}>
            {cart.products.length !== 0 ? (<>
                    <div className="flex justify-between  lg:flex-row flex-col ">
                        <div className={`lg:basis-[68%] py-4 px-4   `}
                             onClick={() => {
                                 mobileShowBasketDetail && setMobileShowBasketDetail(!mobileShowBasketDetail)
                             }}
                        >
                            <div className="flex items-end justify-between pt-1 pb-4 mb-4 border-b-2">
                                <p className="text-[1.406rem] md:font-semibold font-base">Alışveriş
                                    Sepeti <span>({cart.totalQuantity})</span></p>
                                <Link href="/menu" className="hover:underline text-[0.875rem] mr-4 md:block hidden">Alışverişe
                                    Devam
                                    Et</Link>
                            </div>
                            {cart.products.map((product, index) => {
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
                                            className="flex flex-col md:flex-row md:gap-0 gap-2 items-start md:h-full w-full justify-between md:basis-[56.365%] md:mr-2 md:mt-0 mt-2">
                                            <div
                                                className="md:flex hidden flex-row  items-center justify-center gap-4 ml-0 md:ml-[2.125rem]  ">
                                                <div
                                                    className="border-[1px] border-secondary w-5 h-5 rounded-full
                                            text-md flex items-center justify-center outline-none cursor-pointer"
                                                    onClick={() => decreaseItemHandler(product)}
                                                >-
                                                </div>
                                                <p>{product.productTotal}</p>
                                                <div
                                                    className="border-[1px] border-secondary w-5 h-5 rounded-full text-md
                                            flex items-center justify-center outline-none cursor-pointer"
                                                    onClick={() => increaseItemHandler(product)}
                                                >+
                                                </div>

                                            </div>

                                            <div className="flex flex-row border-2 py-1 px-1 rounded-lg
                                      items-center justify-center gap-4 ml-0  md:hidden outline-none cursor-pointer">
                                                <div
                                                    className="  w-5 h-5  text-md flex items-center justify-center text-xl font-semibold "
                                                    onClick={() => decreaseItemHandler(product)}
                                                >-
                                                </div>
                                                <p>{product.productTotal} Adet</p>
                                                <div
                                                    className=" w-5 h-5  text-md flex items-center justify-center
                                            text-xl font-semibold outline-none cursor-pointer"
                                                    onClick={() => increaseItemHandler(product)}
                                                >+
                                                </div>
                                            </div>

                                            <div
                                                className="flex items-center justify-between md:h-full md:flex-col flex-row">

                                                <div
                                                    className="flex items-center justify-center w-full md:items-end md:flex-col flex-row md:gap-1 gap-4">

                                    <span
                                        className="line-through text-base md:text-sm text-cadetGray">{new Intl.NumberFormat('tr-TR', {
                                        style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                    }).format((product.price * product.productTotal * 111.43 / 100))}
                                    </span>
                                                    <span
                                                        className="font-semibold font-workSans text-base md:text-[1.2rem] text-primary">
                                                {new Intl.NumberFormat('tr-TR', {
                                                    style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                                }).format((product.price * product.productTotal))}
                                        </span>
                                                </div>
                                                <div
                                                    className=" flex md:w-full  justify-end mr-2 mb-2  md:hover:text-danger   cursor-pointer outline-none
                                                  md:static md:top-0 md:right-0 md:text-lg md:text-secondary  absolute top-2 right-[-1rem] text-2xl text-stateGray
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


                        <div className={` lg:basis-[32%] w-full flex items-center justify-center md:block hidden h-full
                   sticky top-10 mt-16 lg:mb-0  mb-[6.6rem]`}>
                            <div
                                className={`min-h-[11.255rem] w-full  font-medium  rounded-tr-lg rounded-tl-lg `}>
                                <div className="p-[0.948rem]  border-[1.1px]">
                                    <div className="text-[1.063rem] md:mt-0 mt-10 font-workSans mb-5">Sipariş Özeti</div>
                                    <div className="text-sm font-sans self-start text-left pb-3 ">
                                        <div
                                            className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] mb-2 border-b-2">
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
                                            <span className=" font-semibold">     {new Intl.NumberFormat('tr-TR', {
                                                style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                            }).format((cart.cargoPrice))}</span>
                                        </div>
                                        {isCouponCode && couponCodePrice !== 0 &&(
                                            <div
                                                className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] my-2 pb-2 border-b-[1.11px] ">
                                                <span className="text-sm">Kupon Kodu</span>
                                                <span className=" font-semibold">{new Intl.NumberFormat('tr-TR', {
                                                    style: 'currency', currency: 'TRY', minimumFractionDigits: 2,
                                                }).format((Math.abs(couponCodePrice) * -1))}</span>
                                            </div>
                                        )}

                                        <div
                                            className="w-full flex flex-row items-center justify-between text-[#212529] text-[0.95rem] mt-2 border-b-[1.1px]">
                                            <span className="text-base font-bold ">Toplam</span>
                                            <span className=" font-semibold">{new Intl.NumberFormat('tr-TR', {
                                                style: 'currency',
                                                currency: 'TRY',
                                                minimumFractionDigits: 2
                                            }).format((cart.mainTotal))}₺</span>

                                        </div>


                                    </div>
                                </div>
                                <div
                                    className="border-l-[1.11px]  border-r-[1.11px] border-b-[1.11px] rounded-br-lg rounded-bl-lg  w-full">
                                    <div className="flex items-center justify-center flex-col w-full ">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="text-xs underline p-[0.938rem] font-bold cursor-pointer "
                                                 onClick={() => setShowCouponCode(!showCouponCode)}>Kupon Kodu Kullan
                                            </div>
                                            {showCouponCode &&
                                                <>
                                                    <div className=" pb-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Kupon Kodu"
                                                            className="p-3 rounded-tl-xl rounded-bl-xl border-[1px] outline-none"
                                                            onChange={(e) => {
                                                                setTextCouponCode(e.target.value)
                                                            }}
                                                        />
                                                        <button
                                                            className=" h-full text-primary px-5 py-3.5 border-[1.11px] border-primary rounded-tr-xl rounded-br-xl outline-none "
                                                            onClick={ApplyCouponCode}
                                                        >
                                    <span
                                        className="flex items-center justify-center gap-1 uppercase text-sm">Kullan <BiRightArrowAlt/></span>
                                                        </button>


                                                    </div>
                                                    <div className="flex items-center justify-center gap-2 mb-2">
                                                        {textCouponCode.length > 0 &&
                                                            <>
                                                                {isCouponCode ?
                                                                    <BsShieldFillCheck
                                                                        className="text-green-600 text-xl"/> :
                                                                    <HiOutlineXMark className="text-danger text-xl"/>}
                                                                <p className="text-lg">{textCouponCode}</p>
                                                            </>
                                                        }
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full p-2 bg-primary text-tertiary rounded-lg mt-2 "
                                        onClick={() => routeCheckoutPage()}
                                        disabled={isLoading}
                                >Siparişi Tamamla
                                </button>
                            </div>
                        </div>

                        <div className={`fixed bottom-0 bg-primary z-50 px-6 pb-6 pt-2 w-full md:hidden block 
            ${mobileShowBasketDetail ? "z-50 " : "border-t-[1px] border-tertiary"}
            `}>
                            <div>
                                <div
                                    className={`flex items-center justify-between flex-row mt-1 
                                     font-semibold ${mobileShowBasketDetail ? "mb-3" : "mb-[-0.2rem]"}`}>
                                    <div className={`flex item-center justify-center gap-2  `}>
                                        <span className="place-self-start"
                                              onClick={() => setMobileShowBasketDetail(!mobileShowBasketDetail)}>
                                            {mobileShowBasketDetail ? (
                                                <i className="fa-solid fa-chevron-down fa-xs"></i>) : (
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
                                        <span>{new Intl.NumberFormat('tr-TR', {
                                            style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                        }).format((cart.cargoPrice))}</span>
                                    </div>
                                    {isCouponCode && couponCodePrice !== 0 &&(<div className=" flex items-center justify-between mt-2 flex-row  ">
                                        <span>Kupon Kodu</span>
                                        <span>{new Intl.NumberFormat('tr-TR', {
                                            style: 'currency', currency: 'TRY', minimumFractionDigits: 2
                                        }).format((Math.abs(couponCodePrice) * -1))}</span>
                                    </div>)}
                                </>}
                                <button
                                    className="w-full p-2 bg-tertiary text-secondary z-[20000]  mt-3 uppercase text-sm font-semibold"
                                    disabled={isLoading}
                                    onClick={() => routeCheckoutPage()}
                                >
                                    Sepeti onayla
                                </button>
                            </div>
                        </div>
                    </div>
                </>)
                :
                (<div className="absolute flex items-center justify-center flex-col w-full h-full">
                    <div>
                        Sepetinizde ürün bulunmamaktadır
                    </div>
                    <div
                        className="bg-primary hover:bg-primaryBold rounded-xl p-4 text-tertiary font-semibold text-sm cursor-pointer "
                        onClick={noProductInBasket}
                    >Alışverişe Başla
                    </div>
                </div>)}

        </div>
        <CartMenuItem menuItemClickForCart={menuItemClickForCart} setMenuItemClickForCart={setMenuItemClickForCart}
                      productList={productList}/>
    </div>

}
export const getServerSideProps = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    const product = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=10`)
    return {
        props: {
            userList: res.data ? res.data : [],
            productList: product.data ? product.data : []
        }
    }
}
export default Cart;