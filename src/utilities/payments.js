import Order from "../models/Order";
import Product from "../models/Product";

import PaymentFail from "../models/payment-fail";
import {nanoid} from "nanoid";
import PaymentsSuccess from "./../models/payment-success"
import ShoppingCartUser from "../models/shoppingCartUser";
import CouponCode from "../models/CouponCode";





const CompletePayment = async (result,shoppingBasketId) => {

    if (result?.status === "success") {

        try {

            const payment= await new PaymentsSuccess(
                {
                uid:nanoid(),
                status: result.status,
                cartId: result.basketId,
                conversationId: result.conversationId,
                currency: result.currency,
                paymentId: result.paymentId,
                price: result.price,
                paidPrice: result.paidPrice,
                itemTransaction: result?.itemTransactions.map((item) => {
                    return {
                        uid:nanoid(),
                        itemId: item.itemId,
                        paymentTransactionId: item.paymentTransactionId,
                        price: item.price,
                        paidPrice: item.paidPrice,

                    }
                }),
                log: result
            }
            );

            await payment.save();
            const updatedOrder = await Order.findOneAndUpdate(
                { basketId: result.basketId },
                { completed: true, status: 0, paymentSuccessId: payment._id },
                { new: true }
            );

            const updateProductPromises = updatedOrder.productOrder.map(async (item) => {
                const productId = item.product._id;
                const update = {
                    $inc: { stock: -1, totalSell: 1 }
                };
                return Product.findByIdAndUpdate(productId, update);
            });

            await Promise.all(updateProductPromises);

            const updatedDocument = await ShoppingCartUser.findOne({ shoppingCartId: shoppingBasketId});
            updatedDocument.shoppingCartId=undefined;
             updatedDocument.products=[];
            updatedDocument.couponPrice=undefined;
            updatedDocument.couponId=undefined;
            updatedDocument.cargoPrice=undefined;

             await updatedDocument.save();
             if(updatedOrder){
                 await CouponCode.findByIdAndDelete(updatedOrder.couponId)
             }


        } catch (err) {
            console.log(err);
        }


    } else {
        try {
          const paymentFail=  await new PaymentFail({
                status: result?.status,
                conversationId: result?.conversationId,
                errorCode: result?.errorCode,
                errorMessage: result?.errorMessage,
                log: result
            });
          await paymentFail.save();
        } catch (err) {
            console.log(err);
        }

    }

}
export default CompletePayment;