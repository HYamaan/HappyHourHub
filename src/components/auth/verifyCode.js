import {useRouter} from "next/router";
import axios from "axios";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import Title from "../../components/UI/Title";
import Input from "../../components/form/Input";
import {AiFillUnlock} from "react-icons/ai";
import Link from "next/link";
import React, {useState} from "react";
import {verifyCodeSchema} from "../../schema/verifyCode";
import LoadingPackman from "./loadingPackman";

const RegisterVerify=({verifyCode})=>{

    const router =useRouter();
    const [isloading,setIsLoading]=useState(false);


    const ResetVerifyCode= async ()=>{
        try {
            setIsLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/userEmailVerify/${verifyCode}`);

            if (res.status===200){
                toast.success("Email Verification Resent !");
                await router.push(`/auth/login`);
                setIsLoading(false);
            }
        }catch (err){
            setIsLoading(false);
            toast.error(err.message);
        }

    }
    const onSubmit = async (values,actions) => {
        try {
            setIsLoading(true);
            const res =await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/userEmailVerify/${verifyCode}`, {...values})

            if (res.status===200){
                toast.success("Success Notification !");
                await router.push(`/auth/login`);
                setIsLoading(false);
            }
        }catch (err){
            toast.error(err.response.data.message);
            setIsLoading(false);
        }

    }
    const formik = useFormik({
        initialValues: {
            verifyCode: "",
        }, onSubmit,
        validationSchema:verifyCodeSchema ,
    });
    const inputInf = [
        {
            id: 1,
            name: "verifyCode",
            type: "text",
            placeholder: "Verify Code",
            value: formik.values.verifyCode,
            errorMessage: formik.errors.verifyCode,
            touched: formik.touched.verifyCode
        },

    ]
    return<>
        {!isloading ? (<div className="container mx-auto">
            <Title className="text-4xl my-6 text-center">Verify Code</Title>
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

                    <div className="flex mx-4 items-center justify-between">
                        <Link href="/auth/login">
            <span className="text-sm underline cursor-pointer text-secondary">
                  Do you  have a account?
                </span>
                        </Link>
                        <div className="text-sm hover:underline cursor-pointer" onClick={(reset)=>ResetVerifyCode()}>Reset Verify Code</div>
                    </div>
                </form>
            </div>
        </div>) : (        <LoadingPackman height={'h-[24.9475rem]'}
                                           size={36}
        />)}
    </>
}
export default RegisterVerify;