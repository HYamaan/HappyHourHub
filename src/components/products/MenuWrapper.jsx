import React from "react";
import Title from "../UI/Title"
import MenuItem from "./MenuItem";

const MenuWrapper = ()=>{
    return<React.Fragment>
        <div className="container mx-auto ">
            <div className="flex flex-col items-center ">
                <Title className="text-[40px]"> Our Menu</Title>
                <div className="mt-10">
                    <button className="px-6 py-2 bg-secondary rounded-3xl text-white">
                        All
                    </button>
                    <button className="px-6 py-2  rounded-3xl ">
                        Burger
                    </button>
                    <button className="px-6 py-2  rounded-3xl ">
                        Pizza
                    </button>
                    <button className="px-6 py-2  rounded-3xl ">
                        Drink
                    </button>

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