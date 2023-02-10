import React from "react";
import {useFormik} from "formik";
import Link from "next/link";

import Title from "../../components/UI/Title";
import Input from "../../components/form/Input";
import {adminSchema} from "../../schema/adminSchema";

const Admin = () => {
    const onSubmit = async () => {
        await new Promise((resolve, _) => {
            return setTimeout(resolve, 2000);
        })
    }
    const formik = useFormik({
        initialValues: {
            username: "", password: "",
        }, onSubmit, validationSchema: adminSchema,
    });
    const inputInf = [{
        id: 1,
        name: "username",
        type: "text",
        placeholder: "Your Username",
        value: formik.values.username,
        errorMessage: formik.errors.username,
        touched: formik.touched.username
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
        <Title className="text-4xl my-6 text-center">Admin Login</Title>
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


                <Link href="/">
            <span className="text-sm underline cursor-pointer text-secondary">
                  Home Page
                </span>
                </Link>
            </form>
        </div>
    </div>
}
export default Admin;