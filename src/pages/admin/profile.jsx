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


const Profile = () => {
    const[tabs,setTabs]=useState(0)
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

    return <React.Fragment>
        <div className="flex md:flex-row flex-col px-10 gap-x-3 min-h-[calc(100vh_-_433px)] mb-20">
            <div className="w-80 flex-shrink-0">
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
                            cursor-pointer hover:text-white transition-all ${tabs === 3 ?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(3)}>
                            <i className="fa fa-window-maximize"></i>
                            <button className="ml-1">Footer</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 4 ?"bg-primary text-tertiary" : ""}`}
                        onClick={closeAdminAccount}>
                            <i className="fa fa-sign-out"></i>
                            <button className="ml-1" type="button" onClick={()=>signOut()}>Exit</button>
                        </li>
                    </ul>
                </div>
            </div>
            {tabs === 0 && (<Product/>)}
            {tabs === 1 && (<Order />)}
            {tabs===2 && (<Category/>)}
            {tabs===3 && (<Footer/>)}
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
