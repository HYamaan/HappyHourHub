import React from "react";
import Link from "next/link";

import {useFormik} from "formik";
import {BsGithub} from "react-icons/bs"

import Input from "../../components/form/Input";
import Title from "../../components/UI/Title";
import {loginSchema} from "../../schema/loginSchema";

const Login = () => {
    const onSubmit = async () => {
        await new Promise((resolve, _) => {
            return setTimeout(resolve, 2000);
        })
    }
    const formik = useFormik({
        initialValues: {
            email: "", password: "",
        }, onSubmit, validationSchema: loginSchema,
    });
    const inputInf = [{
        id: 1,
        name: "email",
        type: "email",
        placeholder: "Your Email",
        value: formik.values.email,
        errorMessage: formik.errors.email,
        touched: formik.touched.email
    }, {
        id: 2,
        name: "password",
        type: "password",
        placeholder: "Your Password",
        value: formik.values.password,
        errorMessage: formik.errors.password,
        touched: formik.touched.password

    }]
    return <div className="container mx-auto">
        <Title className="text-4xl my-6 text-center">Login</Title>
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
                <button type="button" className="btn-primary w-full text-lg">LOGIN</button>

                <button className="bg-secondary text-tertiary text-lg rounded-3xl py-2
                                    flex justify-center items-center gap-x-1
                                     cursor-pointer">
                    <BsGithub/> GITHUB
                </button>
                <Link href="/auth/register">
            <span className="text-sm underline cursor-pointer text-secondary">
                  Do you no have a account?
                </span>
                </Link>
            </form>
        </div>
    </div>
}
export default Login;