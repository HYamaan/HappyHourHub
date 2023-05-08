import * as Yup from 'yup';

export const addAddresses = Yup.object({

    fullName: Yup.string()
        .min(3, 'Full name must be at least 3 characters ')
        .required('Full name is required'),
    phoneNumber: Yup.string()
        .max(10, 'Must be 11 characters ')
        .min(10, 'Must be 11 characters ')
        .required('Phone required'),
    email: Yup.string().email('Invalid email address')
        .required('Email is required'),
    country: Yup.string()
        .required('Country is required'),
    city: Yup.string()
        .required('City is required'),
    district: Yup.string()
        .required('District is required'),
    address: Yup.string()
        .min(10, 'Address must be at least 10 characters ')
        .required('Address is required'),

});