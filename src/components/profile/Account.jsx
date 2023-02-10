import React from "react";
import Title from "../UI/Title";
import Input from "../form/Input";
import {useFormik} from "formik";
import {profileSchema} from "../../schema/profileSchema";

const Account = ()=>{
    const onSubmit = async (values, actions) => {
        await new Promise((resolve, _) => setTimeout(resolve, 2000));
        actions.resetForm();
    }

    const formik = useFormik({
        initialValues: {
            fullName: "", phoneNumber: "", email: "", address: "", job: "", bio: "",
        }, onSubmit, validationSchema: profileSchema,
    });

    const inputsInf = [{
        id: 1,
        name: "fullName",
        type: "text",
        placeholder: "Your Full Name",
        value: formik.values.fullName,
        errorMessage: formik.errors.fullName,
        touched: formik.touched.fullName
    }, {
        id: 2,
        name: "email",
        type: "email",
        placeholder: "Your Email",
        value: formik.values.email,
        errorMessage: formik.errors.email,
        touched: formik.touched.email
    }, {
        id: 3,
        name: "phoneNumber",
        type: "number",
        placeholder: "Your Phone Number",
        value: formik.values.phoneNumber,
        errorMessage: formik.errors.phoneNumber,
        touched: formik.touched.phoneNumber
    }, {
        id: 4,
        name: "address",
        type: "text",
        placeholder: "Your Address",
        value: formik.values.address,
        errorMessage: formik.errors.address,
        touched: formik.touched.address
    }, {
        id: 5,
        name: "job",
        type: "text",
        placeholder: "Your Job",
        value: formik.values.job,
        errorMessage: formik.errors.job,
        touched: formik.touched.job
    }, {
        id: 6,
        name: "bio",
        type: "text",
        placeholder: "Your Bio",
        value: formik.values.bio,
        errorMessage: formik.errors.bio,
        touched: formik.touched.bio
    },

    ];
    return(
        <form className="flex-1 lg:p-8 lg:mt-0 mt-5"
              onSubmit={formik.handleSubmit}>
            <Title className="text-[40px]">Account Settings</Title>
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
export default Account;