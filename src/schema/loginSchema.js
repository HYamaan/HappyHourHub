import * as Yup from 'yup';

export const loginSchema=Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password:Yup.string().min(1,"Minimum 1 character")
        .required('Password is required'),
});