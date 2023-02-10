import * as Yup from 'yup';

export const loginSchema=Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password:Yup.string().min(1,"Minimum 1 character")
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase, one lowercase, one number and one special character."
        ),
});