import React, {useState} from "react";
import {useFormik} from "formik";
import Link from "next/link";

import Title from "../../components/UI/Title";
import Input from "../../components/form/Input";
import { toast } from 'react-toastify';
import axios from "axios";
import {useRouter} from "next/router";
import {AiFillUnlock} from "react-icons/ai";
import {resetPasswordForUser} from "../../schema/resetPasswordForUser";
import LoadingPackman from "../../components/auth/loadingPackman";

const Slug = () => {
    const router =useRouter();
    const { hash } = router.query;
const [isloading,setIsLoading]=useState(false);
    const onSubmit = async (values,actions) => {

        try {

            setIsLoading(true);
            const res =await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/userPassword/${hash}`, {...values})

            if (res.status===200){
                toast.success("Success Notification !");
                await router.push(`/auth/login`);
                setIsLoading(false)
            }
        }catch (err){
            setIsLoading(false)
            await router.push(`/auth/forgotPassword`);
            toast.error(err.response.data.message);
        }
        actions.resetForm();

    }
    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword:""
        }, onSubmit,
        validationSchema:resetPasswordForUser ,
    });
    const inputInf = [
        {
            id: 1,
            name: "password",
            type: "password",
            placeholder: "Your Password",
            value: formik.values.password,
            errorMessage: formik.errors.password,
            touched: formik.touched.password

        },
        {
            id: 2,
            name: "confirmPassword",
            type: "password",
            placeholder: "Your Confirm Password",
            value: formik.values.confirmPassword,
            errorMessage: formik.errors.confirmPassword,
            touched: formik.touched.confirmPassword

        }

    ]
    return <React.Fragment>
        {!isloading ? (<div className="container mx-auto">
            <Title className="text-4xl my-6 text-center">Reset Password</Title>
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
        </div>)
        :(        <LoadingPackman height={'h-[24.9475rem]'}
                                  size={36}
            />)}
    </React.Fragment>
}

export default Slug;