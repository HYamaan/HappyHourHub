import React, {useState} from "react";


import {useFormik} from "formik";
import {profileSchema} from "../../schema/profileSchema";
import Image from "next/image";
import Account from "../../components/profile/Account";
import Password from "../../components/profile/Password";
import Order from "../../components/profile/Order";


const Profile = () => {
    const[tabs,setTabs]=useState(0)

    const onSubmit = async (values, actions) => {
        await new Promise((resolve, _) => setTimeout(resolve, 2000));
        actions.resetForm();
    }

    const formik = useFormik({
        initialValues: {
            fullName: "", phoneNumber: "", email: "", address: "", job: "", bio: "",
        }, onSubmit, validationSchema: profileSchema,
    });

    const inputsInf = [{
        id: 1,
        name: "fullName",
        type: "text",
        placeholder: "Your Full Name",
        value: formik.values.fullName,
        errorMessage: formik.errors.fullName,
        touched: formik.touched.fullName
    }, {
        id: 2,
        name: "email",
        type: "email",
        placeholder: "Your Email",
        value: formik.values.email,
        errorMessage: formik.errors.email,
        touched: formik.touched.email
    }, {
        id: 3,
        name: "phoneNumber",
        type: "number",
        placeholder: "Your Phone Number",
        value: formik.values.phoneNumber,
        errorMessage: formik.errors.phoneNumber,
        touched: formik.touched.phoneNumber
    }, {
        id: 4,
        name: "address",
        type: "text",
        placeholder: "Your Address",
        value: formik.values.address,
        errorMessage: formik.errors.address,
        touched: formik.touched.address
    }, {
        id: 5,
        name: "job",
        type: "text",
        placeholder: "Your Job",
        value: formik.values.job,
        errorMessage: formik.errors.job,
        touched: formik.touched.job
    }, {
        id: 6,
        name: "bio",
        type: "text",
        placeholder: "Your Bio",
        value: formik.values.bio,
        errorMessage: formik.errors.bio,
        touched: formik.touched.bio
    },

    ];

    return <React.Fragment>
        <div className="flex md:flex-row flex-col px-10 gap-x-3 min-h-[calc(100vh_-_433px)]">
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
            {tabs === 0 && (<Account formik={formik} inputsInf={inputsInf}/>)}
            {tabs === 1 && (<Password />)}
            {tabs===2 && (<Order/>)}
        </div>
    </React.Fragment>
}
export default Profile;
