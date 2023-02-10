import React from "react";
import Title from "../UI/Title";
import Input from "../form/Input";

import {useFormik} from "formik";


import {changePasswordSchema} from "../../schema/changePasswordSchema";

const Password = ()=>{
    const onSubmit = async (values, actions) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        actions.resetForm();
        console.log("values", values);
    };

    const formik = useFormik({
        initialValues: {
            password:"" ,
            confirmPassword:"",
        }, onSubmit,
        validationSchema: changePasswordSchema,

    });

    const inputsInf = [{
        id: 1,
        name: "password",
        type: "password",
        placeholder: "Your Password",
        value: formik.values.password,
        errorMessage: formik.errors.password,
        touched: formik.touched.password
    }, {
        id: 2,
        name: "confirmPassword",
        type: "password",
        placeholder: "Your Confirm Password",
        value: formik.values.confirmPassword,
        errorMessage: formik.errors.confirmPassword,
        touched: formik.touched.confirmPassword
    },

    ];
    return(
        <form className="flex-1 p-8 "
              onSubmit={formik.handleSubmit}>
            <Title className="text-[40px]">Password</Title>
            <div className="md:grid lg:grid-cols-2 grid-cols-1 md:gap-4 gap-x-11 mt-4">
                {inputsInf.map((input) => {
                    return <Input className="md:mt-0 mt-2"
                                  key={input.id}
                                  {...input}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                    />
                })}
            </div>
            <button className="btn-primary mt-4" type="submit">Update</button>
        </form>
    );
}
export default Password;