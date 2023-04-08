import React from "react";
import {useFormik} from 'formik';

import Input from "./form/Input";
import Title from "./UI/Title";
import {reservationSchema} from "../schema/reservationSchema";
import axios from "axios";
import {toast} from "react-toastify";



const Reservation = () => {
    const onSubmit = async (values, actions) => {

        try {
            const reservation=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reservation`,values);
           // console.log(reservation.data);
            if (reservation.status == 201){
                    toast.success("Your reservation has been made.")
            }else{
                throw new Error();
            }
        }catch (err){
            console.log(err);
        }


        actions.resetForm();
    }

    const formik = useFormik({
        initialValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
            persons: "",
            date: "",
        },
        onSubmit,
        validationSchema: reservationSchema,
    });
    const inputsInf = [
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
            name: "phoneNumber",
            type: "number",
            placeholder: "Your Phone Number",
            value: formik.values.phoneNumber,
            errorMessage: formik.errors.phoneNumber,
            touched: formik.touched.phoneNumber
        },
        {
            id: 3,
            name: "email",
            type: "email",
            placeholder: "Your Email",
            value: formik.values.email,
            errorMessage: formik.errors.email,
            touched: formik.touched.email
        },
        {
            id: 4,
            name: "persons",
            type: "number",
            placeholder: "How Many Persons?",
            value: formik.values.persons,
            errorMessage: formik.errors.persons,
            touched: formik.touched.persons
        },
        {
            id: 5,
            name: "date",
            type: "datetime-local",
            placeholder: "",
            value: formik.values.date,
            errorMessage: formik.errors.date,
            touched: formik.touched.date
        },

    ];


    return <React.Fragment>
        <div className=" container py-12  mx-auto  ">
            <div>
                <Title className="text-[2.5rem] text-bold mb-3 lg:p-0 px-2">Book A Table</Title>
            </div>
            <div className="flex justify-between gap-10 lg:flex-wrap flex-wrap-reverse">
                <form className="lg:flex-1 w-full  lg:p-0 px-5" onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-y-4">
                        {
                            inputsInf.map((input) => (
                                <Input
                                    key={input.id}
                                    {...input}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />))
                        }
                    </div>
                    <button className="btn-primary lg:mt-4 my-4 !py-[10px] !px-[45px]" type="submit">BOOK NOW</button>
                </form>
                <div className="lg:flex-1 w-full rounded-4" >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d36767.463204133965!2d36.20685309191802!3d36.596937637191445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152f5ea37cd6fc2f%3A0xc724c52937ae9d26!2sLiMAKPORT!5e0!3m2!1sen!2str!4v1675872601661!5m2!1sen!2str"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-xl w-full border h-full" ></iframe>
                </div>
            </div>
        </div>
    </React.Fragment>
}
export default Reservation;
