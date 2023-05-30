import React from "react";
import Title from "../../UI/Title";
import Input from "../../form/Input";

import {useFormik} from "formik";
import {changePasswordSchema} from "../../../schema/changePasswordSchema";
import axios from "axios";

import {toast} from "react-toastify";

const Password = ({user})=>{
    const onSubmit = async (values, actions) => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
                values
            );
            if (res.status===200){
                toast.success("Şifreniz değiştirildi");
            }
        } catch (err) {
            console.log("err",err)
            toast.error(err.response.data.message)
            console.log(err);
        }
        actions.resetForm();
    };


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            currentPassword:"",
            password:"" ,
            confirmPassword:"",
        }, onSubmit,
        validationSchema: changePasswordSchema,

    });

    const inputsInf = [{
        id: 1,
        name: "currentPassword",
        type: "password",
        placeholder: "Eski Şifre",
        value: formik.values.currentPassword,
        errorMessage: formik.errors.currentPassword,
        touched: formik.touched.currentPassword
    },{
        id: 2,
        name: "password",
        type: "password",
        placeholder: "Your Password",
        value: formik.values.password,
        errorMessage: formik.errors.password,
        touched: formik.touched.password
    },
        {
        id: 3,
        name: "confirmPassword",
        type: "password",
        placeholder: "Your Confirm Password",
        value: formik.values.confirmPassword,
        errorMessage: formik.errors.confirmPassword,
        touched: formik.touched.confirmPassword
    }];


    return(
        <form className="lg:ml-5  mt-1 w-full" onSubmit={formik.handleSubmit}>
                <Title className="text-[40px] mt-4 border-b-2 w-full">Password</Title>
                <p className="w-[17.375rem] mt-2" >Aşağıdaki bilgileri doldurarak şifrenizi değiştirebilirsiniz.</p>
            <div className="flex flex-col lg:w-[25.188rem] lg:h-[3.438rem] w-full h-full">
                <div className=" md:grid  grid-cols-1 md:gap-4 gap-x-11 mt-4">
                    {inputsInf.map((input) => {
                        return <Input className="md:mt-0 mt-2 "
                                   key={input.id}
                                   {...input}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                            />

                    })}
                </div>
                <button className="lg:place-self-end mt-4 px-4 py-[0.65rem]  bg-primary rounded-lg text-tertiary
                 text-sm font-semibold uppercase" type="submit">Şifre değiştir</button>
            </div>
        </form>
    );
}
export default Password;