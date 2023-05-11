import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {cartActions} from "../../redux/cartSlice";
import {cartIndexActions} from "../../redux/cartIndex";

import styles from "./MenuItem.module.css";
import Link from "next/link";
import Image from "next/image";
import {FaShoppingCart} from "react-icons/fa"
import {FcLike} from "react-icons/fc";
import {AiOutlineHeart} from "react-icons/ai";
import axios from "axios";

import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {toast} from "react-toastify";

const MenuItem = (prop) => {
    const {likeProd,setLikes,...props}=prop;
    const {data: session} = useSession()
    const cart = useSelector((state) => state.cart);
    const cartIndex = useSelector((state) => state.cartIndex);
    const findCart = cart.products.find((item) => item._id === props._id);
    const dispatch = useDispatch();
    const createProduct = {
        category: props.category,
        createdAt: props.createdAt,
        desc: props.desc,
        image: props.image,
        extraOptions: props.extraOptions,
        extras: [],
        price: props.prices[0],
        title: props.title,
        updatedAt: props.updatedAt,
        _id: props._id,
    }
    const [like, setUnLike] = useState(false);
    useEffect(()=>{
        setUnLike(()=>likeProd.includes(props._id))
    },[props._id])
    const addFavoriteList = async () => {
        try {
            if (session && props) {
                const queryParams = `userId=${session?.user.id}/productId=${props?._id}`;
                const url = `${process.env.NEXT_PUBLIC_API_URL}/userFavoriteListapi/${queryParams}`;

                if (!like) {
                    setUnLike(true);
                    setLikes((prev)=>[...prev,props._id])
                    await axios.post(url);

                } else {
                    console.log("BUrada")
                   setLikes((prev)=>prev.filter(item=>item !== prop._id))
                    setUnLike(false);
                    await axios.delete(url);
                }
            }
            else {
                toast.warn('Please first Login')
            }
        } catch (err) {
            console.log(err);
        }
    }

const handleClick = () => {
    dispatch(cartActions.addProduct({...createProduct, productTotal: 1, addIndex: cartIndex.addToIndex}));
    dispatch(cartIndexActions.addToCartIndex(cartIndex.addToIndex));
}

return <React.Fragment>
    <div className="rounded-3xl bg-secondary">
        <div className="w-full relative bg-tertiary h-[215px] grid place-content-center
                    rounded-bl-[46px] rounded-tl-2xl rounded-tr-2xl peer-hover:scale-120  ">
            <Link href={`/product/${props._id}`}>
                <div className="relative w-36 h-36 sm:hover:scale-110 transition-all">
                    <Image src={props.image} alt={props.image} fill style={{objectFit: "contain"}}
                           sizes="w-full h-full" priority={true}/>
                </div>
            </Link>
            <div className={`${styles.favoriButton}`}
                 onClick={() => addFavoriteList()}
            >
                {like ? (<FcLike className="text-lg"/>) : (<AiOutlineHeart className="text-xl"/>)}
            </div>
        </div>
        <div className=" text-[#ffff] p-[25px]">
            <div className="text-left">
                <h3 className="text-lg font-semibold">{props.title}</h3>
                <div className="text-[15px] mt-2">
                    {props.desc}
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div>${props.prices[0]}</div>
                <button className="btn-primary !w-10 !h-10 rounded-full !p-0 grid place-content-center"
                        onClick={handleClick} disabled={findCart}>
                    <FaShoppingCart/>
                </button>
            </div>
        </div>
    </div>
</React.Fragment>
}
export default MenuItem;