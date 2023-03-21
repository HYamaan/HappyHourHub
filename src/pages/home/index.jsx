import React from "react";

import Carousel from "../../components/Carousel";
import Campaigns from "../../components/Campaigns";
import MenuWrapper from "../../components/products/MenuWrapper";
import About from "../../components/About";
import Reservation from "../../components/Reservation";
import Customers from "../../components/customers/Customers";

const Home=({categoryList,productList})=>{
   // console.log(categoryList)
    return <div >
        <div className="relative">
            <Carousel/>
        </div>
        <Campaigns/>
        <MenuWrapper categoryList={categoryList} productList={productList}/>
        <About/>
        <Reservation/>
        <Customers/>

    </div>
}

export default Home;