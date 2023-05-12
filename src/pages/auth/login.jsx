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
import LoadingPackman from "../../components/auth/loadingPackman";
import {useDispatch, useSelector} from "react-redux";
import {cartActions} from "../../redux/cartSlice";
import {cartIndexActions} from "../../redux/cartIndex";
import {userInfoActions} from "../../redux/userInfo";


const Login = () => {

    const {data: session} = useSession();
    const [currentUser, setCurrentUser] = useState();
    const [isLogin,setIsLogin]=useState(false);
    const router = useRouter();
    const cart = useSelector(state => state.cart)
    const cartIndex = useSelector((state) => state.cartIndex);
    const dispatch =useDispatch();
    const DBtoReduxCart=async ()=>{
        try {
            const queryParams = `userId=${currentUser._id}`;
            const url = `${process.env.NEXT_PUBLIC_API_URL}/userProductList/user-shopping-cart/${queryParams}`;
            if (currentUser ) {
                if( cart.totalQuantity > 0){
                    const res = await axios.post(url,cart);
                    if(res.status===201){
                        console.log("LOGIN RES",res)
                        const res =await axios.get(url);
                        console.log("RES",res.data);
                        dispatch(cartActions.reset());
                        res.data.products.map(item=> {
                            const { product, ...rest } = item;
                            dispatch(cartActions.addProduct({ ...product, ...rest ,addIndex: cartIndex.addToIndex}))
                            dispatch(cartIndexActions.addToCartIndex(cartIndex.addToIndex));
                        })
                    }
                }else{
                    const res =await axios.get(url);
                    console.log("RES",res.data);
                    dispatch(cartActions.reset());
                    res.data.products.map(item=> {
                        const { product, ...rest } = item;
                        dispatch(cartActions.addProduct({ ...product, ...rest ,addIndex: cartIndex.addToIndex}))
                        dispatch(cartIndexActions.addToCartIndex(cartIndex.addToIndex));
                    })
                }

            }

        }catch (err){
            console.log(err.message)
        }
    }

    const onSubmit = async (values, actions) => {
        const {email, password} = values;
        let options = {redirect: false, email, password}
        try {
            setIsLogin(true);
            const res = await signIn("credentials", options);
            if (res.ok) {
                toast.success("Successfully Sign in")
            } else {
                setIsLogin(false)
                toast.error(res.error)
            }
        } catch (err) {
            setIsLogin(false)
            console.log(err)
        }
    }
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
                const currentUser = res?.data?.find((user) => user.email === session?.user?.email);
                setCurrentUser(currentUser);
            } catch (err) {
                console.log(err);
            }
        };

        getUser();
    }, [session, setCurrentUser]);

    useEffect(()=>{
        if(currentUser !==undefined){
            DBtoReduxCart();
        }
    },[currentUser])


    useEffect(() => {
            const pushLogin=async ()=>{
                if (currentUser && session) {
                   await router.push(`/profile/${currentUser._id}`);

                }
            }
        pushLogin()
    }, [currentUser, session, router.push]);

    router.events.on('routeChangeComplete', () => {
        setIsLogin(false);

    });


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

    return <>
        {
            !isLogin ? (<div className="container mx-auto">
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
            </div>) : (
                <LoadingPackman height={'h-[24.9475rem]'}
                                size={36}
                />

            )
        }</>
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