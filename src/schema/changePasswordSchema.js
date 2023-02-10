import * as Yup from 'yup';

export const changePasswordSchema = Yup.object({
    password:Yup.string().min(6,"Minimum 6 character")
        .required('Password is required'),
    confirmPassword: Yup.string()
            .min(6,"Minimum 6 character")
        .required('Confirm Password is required')

        .oneOf([Yup.ref('password'),null], 'Passwords must no match')


});