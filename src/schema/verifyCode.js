import * as Yup from 'yup';

export const verifyCodeSchema = Yup.object({


    verifyCode: Yup.string()
        .max(6, 'Must be 6 characters ')
        .min(6, 'Must be 6 characters ')
        .required('Verify Code required'),


});