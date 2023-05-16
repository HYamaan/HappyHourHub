import * as Yup from 'yup';

export const addAddresses = Yup.object({
    caption:Yup.string().required("Caption name is required."),
    customerFullName: Yup.string()
        .min(3, 'Full name must be at least 3 characters ')
        .required('Full name is required'),
    phoneNumber: Yup.string()
        .required('Phone required'),
    email: Yup.string().email('Invalid email address')
        .required('Email is required'),
    address: Yup.string()
        .min(10, 'Address must be at least 10 characters ')
        .required('Address is required'),

});