import React, {useEffect, useState} from "react";

import Title from "../UI/Title"
import MenuItem from "./MenuItem";
import {useSession} from "next-auth/react";
import axios from "axios";
import {useSelector} from "react-redux";

const MenuWrapper = ({categoryList ,productList})=>{
    const {data:session}=useSession();

    const [isActive,setIsActive] =useState(0);
    const [filter,setFilter] =useState(0);
    const [productLimit,setProductLimit] =useState(3);
    const [likes, setLikes] = useState([]);


    useEffect(()=>{
        const getFavoriteProducts= async ()=>{
            try {
                const queryParams = `userId=${session?.user.id}`;
                const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-favorite-list/${queryParams}`;
                if(session){
                    const res = await axios.get(url);
                    setLikes(res.data.products.map(item=>item._id))

                }

            }catch (err){
                console.log(err);
            }
        }
        getFavoriteProducts();
    },[session,setLikes,isActive])


    useEffect(()=>{
       if(likes){
           setFilter(()=>productList.filter((product)=>product.category === categoryList[isActive].title.toLowerCase()))
       }
    },[productList,categoryList,isActive]);


    const favoriteProduct = useSelector((state)=>state.favoriteProducts)
    console.log("favoriteProduct",favoriteProduct)

    return<React.Fragment>
        <div className="container mx-auto ">
            <div className="flex flex-col items-center ">
                <Title className="text-[40px]"> Our Menu</Title>
                <div className="mt-10">
                    {categoryList && categoryList?.map((categories,index)=>(
                        <button className={`px-6 py-2  rounded-3xl mx-1 
                        ${index === isActive && "bg-secondary text-white"}
                        `} key={categories._id}
                        onClick={()=> {
                            setIsActive(index);
                            setProductLimit( 3)
                        }}>
                            {categories.title}
                        </button>
                        ))}
                </div>
            </div>
            <div className="min-h-[596px]">
                <div className="mt-8 mb-11 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 ">

                    { filter.length>0 &&
                        filter.slice(0,productLimit).map((product)=>{
                            return <MenuItem key={product._id}
                                             setLikes={setLikes}
                                             likeProd={likes}
                                             {...product}/>
                        })}

                </div>

                <div className="flex justify-center">
                    <button className="btn-primary mb-24 !py-[10px] !px-[55px]"
                        onClick={()=>setProductLimit(productLimit + 3)}
                    >View More
                    </button>
                </div>
            </div>
        </div>
    </React.Fragment>
}
export default MenuWrapper;