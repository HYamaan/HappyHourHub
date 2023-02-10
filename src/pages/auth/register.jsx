import React from "react";
import {useFormik} from "formik";
import Link from "next/link";

import Title from "../../components/UI/Title";
import Input from "../../components/form/Input";
import {registerSchema} from "../../schema/registerSchema";

const Register = () => {
    const onSubmit = async () => {
        await new Promise((resolve, _) => {
            return setTimeout(resolve, 2000);
        })
    }
    const formik = useFormik({
        initialValues: {
            fullName:"",
            email: "",
            password: "",
            confirmPassword:""

        }, onSubmit,
        validationSchema:registerSchema ,
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
    return <div className="container mx-auto">
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
                <button type="button" className="btn-primary w-full text-lg">Register</button>


                <Link href="/auth/login">
            <span className="text-sm underline cursor-pointer text-secondary">
                  Do you  have a account?
                </span>
                </Link>
            </form>
        </div>
    </div>
}
export default Register;