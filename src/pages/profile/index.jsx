import React, {useState} from "react";


import {useFormik} from "formik";
import {profileSchema} from "../../schema/profileSchema";
import Image from "next/image";
import Account from "../../components/profile/Account";
import Password from "../../components/profile/Password";
import Order from "../../components/profile/Order";


const Profile = () => {
    const[tabs,setTabs]=useState(0)



    return <React.Fragment>
        <div className="flex md:flex-row flex-col px-10 gap-x-3 min-h-[calc(100vh_-_433px)] mb-20">
            <div className="w-80 flex-shrink-0">
                <div className="relative flex flex-col items-center px-10 py-5 border border-b-0">
                    <Image
                        src="/images/client1.jpg"
                        alt="client1.jpg"
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                    <b className="text-2xl mt-1"> Hakan Yaman</b>
                </div>
                <div>
                    <ul className="text-center font-semibold">
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 0 ?"bg-primary text-tertiary" : ""}`}
                        onClick={()=>setTabs(0)}>
                            <i className="fa fa-home"></i>
                            <button className="ml-1"> Account</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 1 ?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(1)}
                        >
                            <i className="fa fa-key"></i>
                            <button className="ml-1">Pasword</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 2 ?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(2)}>
                            <i className="fa fa-motorcycle"></i>
                            <button className="ml-1"> Orders</button>
                        </li>
                        <li className={`border w-full p-3 hover:bg-primary
                            cursor-pointer hover:text-white transition-all ${tabs === 3 ?"bg-primary text-tertiary" : ""}`}
                            onClick={()=>setTabs(3)}>
                            <i className="fa fa-sign-out"></i>
                            <button className="ml-1">Exit</button>
                        </li>
                    </ul>
                </div>
            </div>
            {tabs === 0 && (<Account />)}
            {tabs === 1 && (<Password />)}
            {tabs===2 && (<Order/>)}
        </div>
    </React.Fragment>
}
export default Profile;
