import {useDispatch, useSelector} from "react-redux";
import {FaShoppingCart} from "react-icons/fa";
import React, {useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import Link from "next/link";
import {cartActions} from "../../redux/cartSlice";



const ShoppingBasket = ({router,isMenuModal})=>{
    const cart = useSelector(state=>state.cart);
    const dispatch=useDispatch();
    const [showBasket, setShowBasket] = useState(false);
    const {push}=useRouter();
    const handleProductClick=async (prodId)=>{
        try {
            await push(`/product/${prodId}`)
            setShowBasket(false);
        }catch (err){
            console.log(err);
        }
    }
    console.log(cart.products)
    const moveToBasket =async ()=>{
        try {
            await push(`/cart`);
            setShowBasket(false)
        }catch (err){
            console.log(err);
        }
    }
    const deleteProduct=(prod)=>{
        dispatch(cartActions.removeProduct(prod));
    }
    return<>
        <Link href="/cart" className= {`relative ${router.pathname === "/cart" ? "text-primary" : ""}`}>
            <span className="relative z-0" onClick={()=>setShowBasket(false)}>
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
                <div  className="overflow-x-hidden overflow-y-auto max-h-[20.813rem] pt-4 px-2">
                    {cart.products.map((prod,index) => {
                        const isLastItem = index === cart.products.length - 1;
                        return <div key={index}
                                    className={`flex items-center flex-row w-[21.688rem] h-[6rem] hover:bg-[#D3D6D9] 
                           ${!isLastItem ? "border-b-2 border-secondary border-opacity-40 " :""}`}

                        >
                            <div className="basis-3/12 cursor-pointer" >
                                <Image
                                    src={prod?.image}
                                    alt={prod?.image}
                                    width={90}
                                    height={90}
                                    priority={true}
                                    className="rounded-full"
                                    onClick={()=>handleProductClick(prod?._id)}
                                />
                            </div>
                            <div className="basis-8/12 text-xs text-cadetGray ml-2 top-2" >
                                <p >{prod.title}</p>
                                <p>{`${prod.extras.length>0 ? "Options: " : ""}${prod.extras.map(ext=>ext.text).join(', ')}`}</p>
                                <p>{new Intl.NumberFormat('tr-TR', {style: 'currency', currency: 'TRY', minimumFractionDigits: 2}).format((prod.price))}₺</p>
                                <p>{`Adet: ${prod.productTotal}`}</p>
                            </div>
                            <div className="basis-1/12 h-full mt-2 place-self-start text-secondary hover:text-danger text-xl cursor-pointer "
                                 onClick={()=>deleteProduct(prod)}
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
            </div>
  }
    </>
}
export default ShoppingBasket;