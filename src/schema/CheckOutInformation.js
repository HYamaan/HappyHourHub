import * as Yup from "yup";

export const CheckOutSchema = Yup.object({
    cardNumber: Yup.number().required("Enter your 16-digit card number.").max(16).min(16),
    cardHolderName: Yup.number().required("Cart holder name is required."),
    cvv: Yup.number().required("Cart CVV is required.").max(3).min(3),

});