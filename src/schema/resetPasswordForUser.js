import * as Yup from 'yup';

export const resetPasswordForUser=Yup.object({
    password:Yup.string().min(1,"Minimum 1 character")
        .required('Password is required'),

    confirmPassword:Yup.string().min(1,"Minimum 1 character")
        .required('Password is required')
        .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
});