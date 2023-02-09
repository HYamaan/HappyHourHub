import React from "react";
import Carousel from "../../components/Carousel";
import Campaigns from "../../components/Campaigns";
import MenuWrapper from "../../components/products/MenuWrapper";
import About from "../../components/About";

import Reservation from "../../components/Reservation";

const Home=()=>{
    return <div >
        <div className="relative">
            <Carousel/>
        </div>
        <Campaigns/>
        <MenuWrapper/>
        <About/>
        <Reservation/>
    </div>
}
export default Home;