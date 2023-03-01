import React, {useState} from "react";
import Image from "next/image";
import Title from "../../components/UI/Title";

import {useSelector, useDispatch} from "react-redux";
import {cartActions} from "../../redux/cartSlice"
import axios from "axios";



const Id = ({ food}) => {
    //console.log(food)
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const [prices, setPrices] = useState(food.prices);
    const [price, setPrice] = useState(prices[0]);
    const [size, setSize] = useState(0);
    const [extraItems, setExtraItems] = useState(food.extraOptions);
    const [extras, setExtras] = useState([])

    const handleSize = (sizeIndex) => {
        const difference = prices[sizeIndex] - prices[size];
        setSize(sizeIndex)
        changePrice(difference)

    }
    const changePrice = (number) => {
        setPrice(price + number)

        //console.log(price)
    }
    const handleChange = (e, item) => {

        const checked = e.target.checked;
        if (checked) {
            changePrice(item.price);
            setExtras([...extras, item])
        } else {
            changePrice(-item.price)
            setExtras(extras.filter(el => el.id !== item.id));
        }

    }
    //console.log(extras);

    const handleClick=()=>{
        dispatch(cartActions.addProduct({...food,extras,price}));
        console.log(cart)
    }



    return <React.Fragment>

        <div className="h-[calc(100vh_-_88px)] flex flex-wrap  items-center md:gap-14 md:p-20 ">
            <div className="relative lg:flex-1 w-[80%] lg:h-full md:h-[50%] h-[40%] lg:mx-0 mx-20">
                <Image src={food.image} alt="f1" fill style={{objectFit: "contain"}} sizes="w-full h-full"/>
            </div>
            <div className="lg:flex-1  lg:text-start text-center ">
                <Title className="text-5xl">{food.title}</Title>
                <span className="text-primary text-2xl font-bold underline
            underline-offset-3 inline-block my-4">
                    ${price}
                </span>
                <p className="text-sm lg:my-4 lg:pr-24 py-4 lg:mx-0 mx-[1rem]">
                    {food.desc}
                </p>
                {food.prices.length > 1  && <div>
                    <h4 className="font-bold text-xl mb-2">Choose the Size</h4>
                    <div className="flex items-center gap-x-20
                                lg:justify-start justify-center">
                        <div className="relative w-8 h-8 cursor-pointer" onClick={() => handleSize(0)}>
                            <Image src="/images/size.png" alt="size" fill sizes="w-full h-full"/>
                            <span className="absolute top-0 -right-6 text-xs
                        bg-primary rounded-full px-[5px] font-medium">
                            Small
                        </span>
                        </div>
                        <div className="relative w-12 h-12 cursor-pointer" onClick={() => handleSize(1)}>
                            <Image src="/images/size.png" alt="size" fill sizes="w-full h-full"/>
                            <span className="absolute top-0 -right-8 text-xs
                        bg-primary rounded-full px-[5px] font-medium">
                            Medium
                        </span>
                        </div>
                        <div className="relative w-16 h-16 cursor-pointer" onClick={() => handleSize(2)}>
                            <Image src="/images/size.png" alt="size" fill sizes="w-full h-full"/>
                            <span className="absolute top-0 -right-5 text-xs
                        bg-primary rounded-full px-[10px] font-medium">
                            Large
                        </span>
                        </div>
                    </div>
                </div>}
                <div className="flex gap-x-4 my-6 lg:justify-start justify-center">
                    {food.extraOptions.map((item)=>
                        <label className="flex items-center gap-x-1" key={item._id}>
                            <input type="checkbox" className="w-5 h-5 accent-primary "
                                   onChange={(e) => handleChange(e, item)}/>
                            <span className="text-sm font-semibold">{item.text}</span>
                        </label>
                    )}

                </div>
                <button className="btn-primary " onClick={handleClick}>Add to Cart</button>
            </div>
        </div>
    </React.Fragment>
}
export const getServerSideProps = async ({params})=>{

    const product = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`)
    return{
        props:{
            food: product.data ? product.data :[],
        }
    }
}
export default Id;