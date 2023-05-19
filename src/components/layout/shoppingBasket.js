import {useDispatch, useSelector} from "react-redux";
import {FaShoppingCart} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import Link from "next/link";
import {cartActions} from "../../redux/cartSlice";
import {useSession} from "next-auth/react";
import axios from "axios";



const ShoppingBasket = ({router,isMenuModal,showBasket,setShowBasket})=>{
    const cart = useSelector(state=>state.cart);
    const dispatch=useDispatch();
    const {push}=useRouter();
    const {data:session}=useSession();
    const [isHandleClick,setIsHandleClick]=useState(false);
    const [product,setProduct]=useState(null);

    //console.log("SHOPPİNG KART",JSON.parse(JSON.parse(localStorage.getItem("persist:root")).cart))
    const moveToBasket =async ()=>{
        try {
            await push(`/cart`);
            setShowBasket(false)
        }catch (err){
            console.log(err);
        }
    }
    const deleteProduct=(prod)=> {
        setIsHandleClick(true)
        setProduct(prod);
        dispatch(cartActions.removeProduct(prod));
    }
    useEffect(()=>{
        const DBtoReduxCart=async ()=>{
             setTimeout(async ()=>{
                if(isHandleClick && product){
                    setIsHandleClick(false);
                    try {
                        console.log("product",product._id)
                        const queryParams = `userId=${session?.user?.id}`;
                        const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-shopping-cart/${queryParams}`;
                        if (session?.user) {

                            await axios.delete(url, { data: { sku: product.sku } });

                        }

                    }catch (err){
                        console.log(err.message)
                    }
                }},5);
        };

        DBtoReduxCart();
    },[isHandleClick,product])

    return<>
        <Link href="/cart" className= {`relative ${router.pathname === "/cart" ? "text-primary" : ""}`}>
            <span className="relative z-0" onClick={()=>setShowBasket(false)}
                  onMouseLeave={() => {
                      setShowBasket(true);
                  }}
            >
        <FaShoppingCart
            className="relative hover:text-primary transition-all cursor-pointer peer"
            onMouseEnter={() => {
                setShowBasket(true);
            }}

        />
                {!isMenuModal && ( <span className={`absolute text-xs -top-2 -right-2 rounded-full w-4 h-4  font-bold z-0
             flex justify-center items-center ${router.pathname === "/cart" ? "text-secondary bg-tertiary" : "bg-primary text-black"} `}
                >{cart.totalQuantity=== 0 ? "0" : cart.totalQuantity}</span>)}
           </span>
        </Link>


        {showBasket &&
            <div className="absolute right-[10rem] top-[2.5rem] w-[23rem]  bg-tertiary
            md:block hidden "
                 onMouseLeave={() => {
                setShowBasket(false);
            }}>
                {cart.products.length !==0 ? (<>
                    <div  className="overflow-x-hidden overflow-y-auto max-h-[20.813rem] pt-4 px-2">
                        {cart.products.map((prod,index) => {
                            const isLastItem = index === cart.products.length - 1;
                            return <div key={index}
                                        className={`flex items-center flex-row w-[21.688rem] h-[6rem] hover:bg-[#D3D6D9] 
                           ${!isLastItem ? "border-b-2 border-secondary border-opacity-40 " :""}`}

                            >
                                <div className="basis-3/12 self-center cursor-pointer w-full" >
                                    <Link href={`/product/${prod._id}`}>
                                        <Image
                                            src={prod?.image}
                                            alt={prod?.image}
                                            width={70}
                                            height={70}
                                            priority={true}
                                            style={{objectFit: "cover"}}
                                            className="rounded-full object-contain"
                                            onClick={() =>  setShowBasket(false)}
                                        />

                                    </Link>
                                </div>
                                <div className="basis-8/12 self-start text-xs text-cadetGray ml-2 mt-2" >
                                    <p >{prod.title}</p>
                                    <p>{`${prod.extras?.length>0 ? "Options: " : ""}${prod?.extras?.map(ext=>ext.text).join(', ')}`}</p>
                                    <p>{new Intl.NumberFormat('tr-TR', {style: 'currency', currency: 'TRY', minimumFractionDigits: 2}).format((prod.price))}₺</p>
                                    <p>{`Adet: ${prod.productTotal}`}</p>
                                </div>
                                <div className="basis-1/12 h-full mt-2 place-self-start text-secondary hover:text-danger text-xl cursor-pointer "
                                     onClick={()=> {
                                         setProduct(prod)
                                         deleteProduct(prod)
                                     }}
                                >
                                    <i className="fa-solid fa-trash-can"></i></div>
                            </div>
                        })}
                    </div>
                    <div className="flex items-center justify-between h-14 w-full bg-[#D3D6D9] text-secondary">
                        <span className="ml-12">Ara Toplam</span>
                        <span className="font-bold mr-4 ">{new Intl.NumberFormat('tr-TR', {style: 'currency', currency: 'TRY', minimumFractionDigits: 2}).format((cart.total))}₺</span>
                        <div className="bg-primary rounded-2xl py-2 px-4 mr-2 text-tertiary hover:bg-primaryBold cursor-pointer" onClick={()=>moveToBasket()}>Sepete Git</div>
                    </div>
                </>):(<div className="flex items-center justify-center py-4 px-6  leading-6 text-left tracking-wider text-payneGray  lg:text-base text-sm">Sepetinizde ürün bulunmamaktadır</div>)}
            </div>
  }
    </>
}
export default ShoppingBasket;