import React, {useState} from "react";
import {useFormik} from "formik";
import Link from "next/link";

import Title from "../../components/UI/Title";
import Input from "../../components/form/Input";
import {toast} from 'react-toastify';
import {registerSchema} from "../../schema/registerSchema";
import axios from "axios";
import {useRouter} from "next/router";
import LoadingPackman from "../../components/auth/loadingPackman";

const Register = () => {
    const router = useRouter();
    const [isloading, setIsLoading] = useState(false);
    const onSubmit = async (values, actions) => {
        try {
            setIsLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`,
                {...values, image: "https://res.cloudinary.com/dqotmpx6v/image/upload/v1679752797/admin_mitnsq.png"})
            if (res.status === 200) {
                toast.success("Activation code sent to your mailbox");
                await router.push(`/auth/login`);
                setIsLoading(false);
                actions.resetForm();
            }
        } catch (err) {
            setIsLoading(false);
            actions.setFieldValue('password', '');
            actions.setFieldValue('confirmPassword', '');
            toast.error(err.response.data.message);

        }


    }
    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: ""

        }, onSubmit,
        validationSchema: registerSchema,
    });
    const inputInf = [
        {
            id: 1,
            name: "fullName",
            type: "text",
            placeholder: "Your Full Name",
            value: formik.values.fullName,
            errorMessage: formik.errors.fullName,
            touched: formik.touched.fullName
        },
        {
            id: 2,
            name: "email",
            type: "email",
            placeholder: "Your Email",
            value: formik.values.email,
            errorMessage: formik.errors.email,
            touched: formik.touched.email
        },
        {
            id: 3,
            name: "password",
            type: "password",
            placeholder: "Your Password",
            value: formik.values.password,
            errorMessage: formik.errors.password,
            touched: formik.touched.password

        },
        {
            id: 4,
            name: "confirmPassword",
            type: "password",
            placeholder: "Your Confirm Password",
            value: formik.values.confirmPassword,
            errorMessage: formik.errors.confirmPassword,
            touched: formik.touched.confirmPassword

        }

    ]
    return <>
        {!isloading ? (<div className="container mx-auto">
            <Title className="text-4xl my-6 text-center">Register</Title>
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
                    <button type="submit" className="btn-primary w-full text-lg">Register</button>


                    <Link href="/auth/login">
            <span className="text-sm underline cursor-pointer text-secondary">
                  Do you  have a account?
                </span>
                    </Link>
                </form>
            </div>
        </div>) : (<LoadingPackman height={'h-[24.9475rem]'}
                                   size={36}
        />)}
    </>
}
export default Register;