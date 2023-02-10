import * as Yup from 'yup';

export const registerSchema=Yup.object({
    fullName: Yup.string()
        .min(3, 'Full name must be at least 3 characters ')
        .required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password:Yup.string().min(1,"Minimum 1 character")
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase, one lowercase, one number and one special character."
        ),

    confirmPassword:Yup.string().min(1,"Minimum 1 character")
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase, one lowercase, one number and one special character."
        ),
});