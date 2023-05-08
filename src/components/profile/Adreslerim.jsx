import axios from "axios";
import {toast} from "react-toastify";
import {Field, Formik, useFormik} from "formik";
import {profileSchema} from "../../schema/profileSchema";
import Title from "../UI/Title";
import Input from "../form/Input";
import React, {useEffect, useState} from "react";
import {addAddresses} from "../../schema/addAddresses";


const MyAddresses = ({user}) => {



    const onSubmit = async (values, actions) => {
        try {
            console.log("valuesAccont",values)

        } catch (err) {
            console.log(err);
        }

    };

    const { values, errors, touched, handleSubmit, handleChange, handleBlur } =
        useFormik({
            enableReinitialize: true,
            initialValues: {
                fullName: user?.fullName,
                phoneNumber: user?.phoneNumber,
                email: user?.email,
                addAddresses
            },
            onSubmit,
            validationSchema: profileSchema,
        });
    const inputs = [
        {
            id: 1,
            name: "fullName",
            type: "text",
            placeholder: "Your Full Name",
            value: values.fullName,
            errorMessage: errors.fullName,
            touched: touched.fullName,
        },
        {
            id: 2,
            name: "email",
            type: "email",
            placeholder: "Your Email Address",
            value: values.email,
            errorMessage: errors.email,
            touched: touched.email,
        },
        {
            id: 3,
            name: "phoneNumber",
            type: "number",
            placeholder: "Your Phone Number",
            value: values.phoneNumber,
            errorMessage: errors.phoneNumber,
            touched: touched.phoneNumber,
        },
    ];

    return(
        <div className="w-full mx-auto">
            <form className="lg:p-8 flex-1 lg:mt-0 mt-5" onSubmit={handleSubmit}>
                <Title className="text-[40px]">Account Settings</Title>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
                    {inputs.map((input) => (
                        <Input
                            key={input.id}
                            {...input}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                    ))}
                    <Input
                       name={"address"}
                    type={"text"}
                    placeholder={"Your Address"}
                    value={values.address}
                    errorMessage={errors.address}
                    touched={touched.address}
                        onBlur={handleBlur}
                        onChange={handleChange}
                    />

                </div>
                <button className="btn-primary mt-4" type="submit">
                    Update
                </button>
            </form>
        </div>
    )
};

export default MyAddresses;
