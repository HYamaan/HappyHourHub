import React, {useEffect, useState,} from "react";
import {useSession, signIn, getSession} from "next-auth/react"
import Link from "next/link";

import {toast} from 'react-toastify';
import {useFormik} from "formik";
import {BsGithub} from "react-icons/bs"


import Input from "../../components/form/Input";
import Title from "../../components/UI/Title";
import {loginSchema} from "../../schema/loginSchema";

import {useRouter} from "next/router";
import axios from "axios";


const Login = () => {

    const {data: session} = useSession();
    //console.log("LoginSession",session);
    const [currentUser, setCurrentUser] = useState();
    const {push} = useRouter();


    const onSubmit = async (values, actions) => {
        const {email, password} = values;
        let options = {redirect: false, email, password}
        try {
            const res = await signIn("credentials", options);
            if (res.ok) {
                toast.success("Successfully Sign in")
            } else {
                toast.error(res.error)
            }
            actions.resetForm();
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
                setCurrentUser(
                    res.data?.find((user) => user.email === session?.user?.email)
                );
                if (currentUser) {
                    session && await push("/profile/" + currentUser?._id);
                }

            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, [session, push, currentUser]);


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
                <button type="submit" className="btn-primary w-full text-lg">LOGIN</button>

                <button className="bg-secondary text-tertiary text-lg rounded-3xl py-2
                                    flex justify-center items-center gap-x-1
                                     cursor-pointer" type="button"
                        onClick={() => signIn("github", {callbackUrl: "/profile"})}>
                    <BsGithub/> GITHUB
                </button>

                <button className="bg-blue-500 text-tertiary text-lg rounded-3xl py-2
                                    flex justify-center items-center gap-x-1
                                     cursor-pointer" type="button"
                        onClick={() => signIn("google", {callbackUrl: "/profile"})}>
                    <BsGithub/> Google
                </button>
                <div className="flex justify-between px-5">
                    <Link href="/auth/register">
            <span className="text-sm underline cursor-pointer text-secondary">
                  Do you no have a account?
                </span>
                    </Link>
                    <Link href="/auth/forgotPassword">
            <span className="text-sm underline cursor-pointer text-secondary">
                  Forgot password?
                </span>
                    </Link>
                </div>
            </form>
        </div>
    </div>
}

export async function getServerSideProps({req}) {
    const session = await getSession({req});

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    const user = res.data?.find((user) => user.email === session?.user.email);
    if (session && user) {
        return {
            redirect: {
                destination: "/profile/" + user._id,
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };

}

export default Login;