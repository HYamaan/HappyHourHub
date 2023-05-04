import React from "react";
import MenuWrapper from "../../components/products/MenuWrapper";
import axios from "axios";
import ChatBox from "../../components/layout/ChatBox";

const Menu=({categoryList,productList})=>{
    return <React.Fragment>
       <div className="mt-10">
           <MenuWrapper categoryList={categoryList} productList={productList}/>
       </div>
        <ChatBox/>
    </React.Fragment>
}
export const getServerSideProps=async ()=>{
    const category = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
    const product = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
    return{
        props:{
            categoryList: category.data ? category.data :[],
            productList: product.data ? product.data :[],
        }
    }
}
export default Menu;