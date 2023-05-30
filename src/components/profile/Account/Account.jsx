import React from "react";
import Title from "../../UI/Title";
import Input from "../../form/Input";
import {useFormik} from "formik";
import {profileSchema} from "../../../schema/profileSchema";
import axios from "axios";
import {toast} from "react-toastify";

const Account = ({ user }) => {

    const onSubmit = async (values, actions) => {
        try {
            console.log("Burada")
            values.phoneNumber= values.phoneNumber.replace(/[^\d]/g, '');
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
                values
            );
            console.log("valuesAccont",res)
            if(res.status===201){
                toast.success("Profile successfuly updated")
            }
        } catch (err) {
            console.log(err);
        }

    };

    const { values, errors, touched, handleSubmit, handleChange, handleBlur } =
        useFormik({
            enableReinitialize: true,
            initialValues: {
                fullName: user?.fullName || "",
                phoneNumber: user?.phoneNumber || "",
                email: user?.email || "",
                zipCode: user?.zipCode || "",
                bio: user?.bio || "",
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
            mask: "(999) 999 9999",
            type: "tel",
            placeholder: "Your Phone Number",
            value: values.phoneNumber,
            errorMessage: errors.phoneNumber,
            touched: touched.phoneNumber,
        },

        {
            id: 5,
            name: "zipCode",
            type: "text",
            placeholder: "zip Code",
            value: values.zipCode,
            errorMessage: errors.zipCode,
            touched: touched.zipCode,
        },
        {
            id: 6,
            name: "bio",
            type: "text",
            placeholder: "Your Bio",
            value: values.bio,
            errorMessage: errors.bio,
            touched: touched.bio,
        },
    ];
    return (
        <div className="w-full mx-auto">
            <form className="lg:p-8 flex-1 lg:mt-0 mt-5" onSubmit={handleSubmit}>
                <Title className="text-[40px]">Account Settings</Title>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
                    {inputs.map((input) => (
                        <div key={input.id}>
                            <Input
                                key={input.id}
                                {...input}
                                onBlur={handleBlur}
                                onChange={handleChange}/>

                        </div>
                    ))}
                </div>
                <button className="w-[16.188rem] h-[2.688rem] mt-5 bg-primary hover:bg-primaryBold hover:out-expo uppercase flex items-center
            justify-center rounded-lg cursor-pointer text-xs text-tertiary font-semibold"
                        type="submit"
                >Update
                </button>

            </form>
        </div>
    );
};

export default Account;