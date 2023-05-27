import React, {useState} from "react";
import {signOut} from "next-auth/react";

import Image from "next/image";
import Order from "../../components/admin/Order";
import Product from "../../components/admin/product";
import Category from "../../components/admin/Category";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import AddProduct from "../../components/admin/order/AddProduct";
import UserComments from "../../components/admin/UserComments";
import {RiCustomerService2Fill} from "react-icons/ri";
import NewOrder from "../../components/admin/order/newOrder";
import CouponCode from "../../components/admin/couponCode/CouponCode";
import Products from "../../components/admin/product/products";




const Profile = () => {
    const[tabs,setTabs]=useState(0);
    const[isProductModal,setIsProductModal]=useState(false);
    const router =useRouter();
    const closeAdminAccount = async ()=>{
        try {
            if(confirm("Are you sure you want to close your Admin Account")){
        const res= await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin`);

        if(res.status===200){
            await router.push("/admin");
            toast.success("Admin Account Closed!")
        }
            }
        }catch (err){
            console.log(err);
        }
    }
    const customerService=()=>{
        router.push('/customerService');
    }

    return <React.Fragment>
        <div className="flex md:flex-row flex-col lg:px-10 lg:gap-x-3 min-h-[calc(100vh_-_433px)] mb-20 mx-auto w-full px-4">
            <div className="lg:w-80  flex-shrink-0">
                <div className="relative flex flex-col items-center px-10 py-5 border border-b-0">
                    <Image
                        src="/images/admin.png"
                        alt="client1.jpg"
                        width={100}
                        height={100}
                        priority={true}
                        className="rounded-full"
                    />
                    <b className="text-2xl mt-1"> Admin</b>
                </div>
                <div>
                    <ul className="text-center font-semibold">
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 0 ?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(0)}>
                            <i className="fa fa-cutlery"></i>
                            <button className="ml-1"> Products</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 1 ?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(1)}
                        >
                            <i className="fa fa-motorcycle"></i>
                            <button className="ml-1">Orders</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 2 ?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(2)}>
                            <i className="fa fa-ellipsis-h"></i>
                            <button className="ml-1">Categories</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 3?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(3)}>
                            <i className="fa-solid fa-gift"></i>
                            <button className="ml-1">Coupon Code</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 4 ?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(4)}>
                            <i className="fa fa-window-maximize"></i>
                            <button className="ml-1">Footer</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 5 ?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(5)}>
                            <i className="fa-solid fa-comment"></i>
                            <button className="ml-1">Customer Comment</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary flex justify-center
                            cursor-pointer hover:text-white transition-all ${tabs === 6 ?"bg-primary text-tertiary" : ""}`}
                            onClick={customerService}>

                            <button className="ml-1 flex items-center justify-center gap-2">
                                <span><RiCustomerService2Fill/></span>
                                Customer Service</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 6 ?"bg-primary text-tertiary" : ""}`}
                        onClick={closeAdminAccount}>
                            <i className="fa fa-sign-out"></i>
                            <button className="ml-1" type="button" onClick={()=>signOut()}>Exit</button>
                        </li>
                    </ul>
                </div>
            </div>
            {tabs === 0 && (<Products/>)}
            {tabs === 1 && (<NewOrder />)}
            {tabs===2 && (<Category/>)}
            {tabs===3 && (<CouponCode/>)}
            {tabs===4 && (<Footer/>)}
            {tabs===5 && (<UserComments/>)}

            {isProductModal && <AddProduct setIsProductModal={setIsProductModal}/>}
            <button className=" absolute btn-primary !w-12 !h-12 !p-0 bottom-14 right-14 text-4xl"
            onClick={()=>setIsProductModal(true)}>+</button>
        </div>
    </React.Fragment>
}

export const getServerSideProps = (ctx) => {
    const myCookie = ctx.req?.cookies || "";
    if (myCookie.token !== process.env.ADMIN_TOKEN) {
        return {
            redirect: {
                destination: "/admin",
                permanent: false,
            }
        }
    }
    return {
        props: {},
    }
}
export default Profile;
