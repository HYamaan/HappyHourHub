import React, {useState} from "react";
import {useFormik} from "formik";
import Link from "next/link";

import Title from "../../components/UI/Title";
import Input from "../../components/form/Input";
import {adminSchema} from "../../schema/adminSchema";
import axios from "axios";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import PacmanLoader from "react-spinners/PacmanLoader";



const Login = () => {
    const router = useRouter();
    const[loading,setLoading]=useState(true);
    const onSubmit = async (values) => {
       // console.log("values",values);
        try {
            setLoading(false);
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/admin`, values
            );
            setLoading(true);
            if (res.status === 200) {
                toast.success("Success")
                router.push("/admin/profile")
                //console.log(res.data);

            }

        } catch (err) {
            toast.error("err");
            console.error(err);
        }
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
    return (loading ? (<div className="container mx-auto">
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
                <button type="submit" className="btn-primary w-full text-lg">LOGIN</button>

                <Link href="/">
            <span className="text-sm underline cursor-pointer text-secondary">
                  Home Page
                </span>
                </Link>
            </form>
        </div>
    </div>) : (<div className="container  ">
                <div className="flex justify-center items-center h-[24.9475rem] w-screen bg-secondary">
                    <PacmanLoader
                        color="#fff200"
                        cssOverride={{}}
                        loading
                        margin={2}
                        size={36}
                        speedMultiplier={1}
                    />
                </div>
    </div>) )
}
export const getServerSideProps = (context) => {

    const myCookie = context.req?.cookies || "";
    if (myCookie.token === process.env.ADMIN_TOKEN) {
        return {
            redirect: {
                destination: "/admin/profile",
                permanent: false,
            }
        }
    }
    return {
        props: {},
    }
}
export default Login;