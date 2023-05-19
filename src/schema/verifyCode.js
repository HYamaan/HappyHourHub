import * as Yup from 'yup';

export const verifyCodeSchema = Yup.object({


    verifyCode: Yup.string()
        .required('Verify Code required'),


});