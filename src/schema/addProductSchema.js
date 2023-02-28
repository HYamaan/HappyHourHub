import * as Yup from 'yup';

export const addProductSchema=Yup.object({
    title: Yup.string().required('Title is required')
        .min(3,"Title must be at least 3 characters"),

    description: Yup.string().required('Description is required')
        .min(3,"Description must be at least 3 characters"),
    category: Yup
        .string()
        .nullable()
        .required("Please select a Category"),
    small:Yup.number().required('Small is required').positive("Must a positive number").integer(),
    medium:Yup.number().required('Medium is required').positive("Must a positive number").integer(),
    large:Yup.number().required('Large is required').positive("Must a positive number").integer(),
    extra:Yup.string().required('items is required'),
    price:Yup.number().required('items is required').positive("Must a positive number").integer(),

});