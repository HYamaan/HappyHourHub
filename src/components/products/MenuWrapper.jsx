import React, {useEffect, useState} from "react";
import Title from "../UI/Title"
import MenuItem from "./MenuItem";
import Link from "next/link";

const MenuWrapper = ({categoryList ,productList})=>{
    //console.log("categoryList",categoryList,"\n",productList)
    const [isActive,setIsActive] =useState(0);
    const [filter,setFilter] =useState(0);

    useEffect(()=>{
        setFilter(productList.filter((product)=>product.category === categoryList[isActive].title.toLowerCase()))
    },[productList,categoryList,isActive]);


    return<React.Fragment>
        <div className="container mx-auto ">
            <div className="flex flex-col items-center ">
                <Title className="text-[40px]"> Our Menu</Title>
                <div className="mt-10">
                    {categoryList && categoryList.map((categories,index)=>(
                        <button className={`px-6 py-2  rounded-3xl mx-1 
                        ${index === isActive && "bg-secondary text-white"}
                        `} key={categories._id}
                        onClick={()=>setIsActive(index)}>
                            {categories.title}
                        </button>
                        ))}
                </div>
            </div>
            <div className="min-h-[596px]">
                <div className="mt-8 mb-11 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 ">

                    { filter.length>0 &&
                        filter.map((product,index)=>(<MenuItem key={product._id} {...product}/>))}

                </div>
                <div className="flex justify-center">
                    <Link href="/menu" className="btn-primary mb-24 !py-[10px] !px-[55px]">View More</Link>
                </div>
            </div>
        </div>
    </React.Fragment>
}
export default MenuWrapper;