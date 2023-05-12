import React, {useEffect, useState} from "react";
import Image from "next/image";
import Title from "../../components/UI/Title";

import {useSelector, useDispatch} from "react-redux";
import {cartActions} from "../../redux/cartSlice";
import {cartIndexActions} from "../../redux/cartIndex";
import axios from "axios";
import {useRouter} from "next/router";
import shortid from "shortid";



const Id = ({food}) => {

    const dispatch = useDispatch();
    const router =useRouter();
    const sku = shortid.generate();
    const cartIndex = useSelector((state)=>state.cartIndex);
    const productExtrass = useSelector((state)=>state.productExtras);
    const [prices, setPrices] = useState(food.prices);
    const [price, setPrice] = useState(food.prices[0]);
    const [size, setSize] = useState(0);
    const [extras, setExtras] = useState([]);
    const {name} = router.query;
    const [productExtrasID,setProductExtrasID]=useState([]);


    useEffect(()=>{
        if (name){
            productExtrass.productExtras?.extras?.map((item,index)=>{
                const variable = food.extraOptions.some((arr)=>arr._id.includes(item._id));
                if(variable){
                    //setProductExtrasID((prev)=>[...prev,item._id]);
                    autoCheckboxClick(item);
                }
            })
        }
    },[]);



    const handleSize = (sizeIndex) => {
        const difference = prices[sizeIndex] - prices[size];
        setSize(sizeIndex)
        changePrice(difference)
    }

    const changePrice = (number) => {

        //console.log(number + price)
        setPrice((price) => number + price);

    }
    const autoCheckboxClick=(item)=>{
        setProductExtrasID((prev)=>[...prev,item._id]);
        setExtras((prev)=>[...prev,item]);
        changePrice(item.price);

    }

    const handleChange = (e, item) => {



        const checked= productExtrasID?.includes(item._id) ? false : e.target.checked;

        if (checked) {
            autoCheckboxClick(item);
        } else {

            changePrice(-item.price)
            setExtras(extras.filter(el => el.id !== item.id));
            setProductExtrasID(productExtrasID.filter(el => el !== item._id));

        }

    }

    const handleClick=()=>{
        dispatch(cartActions.addProduct({...food,extras,price,productTotal:1,addIndex:cartIndex.addToIndex,sku}));
        dispatch(cartIndexActions.addToCartIndex(cartIndex.addToIndex));

    }



    return <React.Fragment>

        <div className="h-[calc(100vh_-_88px)] flex flex-wrap  items-center md:gap-14 md:p-20 mb-20 ">
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
                        <label className="flex items-center gap-x-2" key={item._id}>
                            { (
                                <input type="checkbox" className="w-5 h-5 accent-primary m "
                                    checked={productExtrasID?.includes(item._id) ? true : false }
                                    onChange={(e) => {
                                        handleChange(e, item);
                                    }}/>
                            )

                            }
                            <span className="text-sm font-semibold">{item.text}</span>
                        </label>
                    )}

                </div>
                <button className="btn-primary sm:mb-0 mb-4" onClick={()=>handleClick()}>Add to Cart</button>
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