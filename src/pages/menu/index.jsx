import React from "react";
import MenuWrapper from "../../components/products/MenuWrapper";
import axios from "axios";

const Menu=({categoryList})=>{
    return <React.Fragment>
       <div className="mt-10">
           <MenuWrapper categoryList={categoryList}/>
       </div>
    </React.Fragment>
}
export const getServerSideProps=async ()=>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
    return{
        props:{
            categoryList: res.data ? res.data :[],
        }
    }
}
export default Menu;