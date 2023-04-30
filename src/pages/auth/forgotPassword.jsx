import React from "react";
import {useFormik} from "formik";
import Link from "next/link";

import Title from "../../components/UI/Title";
import Input from "../../components/form/Input";
import { toast } from 'react-toastify';
import axios from "axios";
import {useRouter} from "next/router";
import {AiFillUnlock} from "react-icons/ai";
import {forgotPasswordForEmail} from "../../schema/forgotPasswordForEmail";

const ForgotPassword = () => {
    const router =useRouter();
    const onSubmit = async (values,actions) => {
        try {

            const res =await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/userPassword/forgotPassword`, {...values})

            if (res.status===200){
                toast.success("Success Notification !");
                await router.push(`/auth/login`);
            }
        }catch (err){
            toast.error(err.response.data.message);
        }
        actions.resetForm();

    }
    const formik = useFormik({
        initialValues: {
            email: "",
        }, onSubmit,
        validationSchema:forgotPasswordForEmail ,
    });
    const inputInf = [
        {
            id: 1,
            name: "email",
            type: "email",
            placeholder: "Your Email",
            value: formik.values.email,
            errorMessage: formik.errors.email,
            touched: formik.touched.email
        },

    ]
    return <div className="container mx-auto">
        <Title className="text-4xl my-6 text-center">Forgot Password</Title>
        <div className="flex justify-center items-center ">
            <form className=" flex flex-col gap-y-4 mb-14 md:w-1/2 w-full" onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-y-4">
                    {inputInf.map((input) => {
                        return <Input
                            key={input.id}
                            {...input}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                        />
                    })}
                </div>
                <button type="submit" className="btn-primary w-full text-lg flex items-center justify-between" >
                    <AiFillUnlock/><span> Continue</span><span></span>
                </button>

                <Link href="/auth/login">
            <span className="text-sm underline cursor-pointer text-secondary">
                  Do you  have a account?
                </span>
                </Link>
            </form>
        </div>
    </div>
}
export default ForgotPassword;