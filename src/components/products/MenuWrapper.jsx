import React, {useState} from "react";
import Title from "../UI/Title"
import MenuItem from "./MenuItem";

const MenuWrapper = ({categoryList})=>{
    const [isActive,setIsActive]=useState(0)
    console.log(categoryList)

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
            <div className="mt-8 mb-11 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
            </div>
            <div className="flex justify-center">
                <button className="btn-primary mb-24 !py-[10px] !px-[55px]">View More</button>
            </div>
        </div>
    </React.Fragment>
}
export default MenuWrapper;