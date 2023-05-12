import * as Yup from 'yup';

export const profileSchema = Yup.object({
    fullName: Yup.string()
        .min(3, 'Full name must be at least 3 characters ')
        .required('Full name is required'),
    phoneNumber: Yup.string()
        .required('Phone required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    address: Yup.string()
        .min(10, 'Address must be at least 10 characters ')
        .required('Address is required'),
    zipCode: Yup.string()
        .min(4, 'zip Code must be at least 4 characters ')
        .required('zipCode is required'),
    bio: Yup.string()
        .min(4, 'Bio must be at least 4 characters ')
        .required('Bio is required'),

});