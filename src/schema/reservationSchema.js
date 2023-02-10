import * as Yup from 'yup';

export const reservationSchema=Yup.object({
    fullName: Yup.string()
        .min(3, 'Full name must be at least 3 characters ')
        .required('Full name is required'),
    phoneNumber: Yup.string()
        .max(10, 'Must be 11 characters ')
        .min(10,'Must be 11 characters ')
        .required('Phone required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    persons:Yup.string().min(1,"Minimum 0 person").required("Persons is required"),
    date:Yup.string().required("Date is required"),

});