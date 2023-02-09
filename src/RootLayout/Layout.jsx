import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Layout=(props)=>{
    return(
        <React.Fragment>
            <Header/>
            <main>{props.children}</main>
            <Footer/>
        </React.Fragment>
    );
}
export default Layout;