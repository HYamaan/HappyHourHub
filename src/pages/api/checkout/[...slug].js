
import Iyzipay from 'iyzipay';
import User from '../../../models/User';

import moment from "moment";
import Order from "../../../models/Order";
import CompletePayment from "../../../utilities/payments";


const handler = async (req, res) => {
    const {method} = req;
    const query = req.query.slug[1];
    const ip = req.connection.remoteAddress || req.headers["x-forwarded-for"];
    console.log("ip", ip)


    const iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_PAYMENT_API_KEY,
        secretKey: process.env.IYZICO_PAYMENT_SECRET_KEY,
        uri: 'https://sandbox-api.iyzipay.com'
    });


    if (req.query.slug[0] === "payments") {

        if (req.query.slug[1] === "complete") {
            if (method === "POST") {
                console.log("req.body____________________________", req.body)
                console.log("req.query____________________________", req.query)

                try {
                    const data = {
                        locale: req.body.locale || Iyzipay.LOCALE.TR,
                        conversationId: req.query.basketId,
                        token: req.body.token,

                    }

                    const result = await new Promise((resolve, reject) => {
                        iyzipay.checkoutForm.retrieve(data, (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    });
                    console.log("result", result)
                    if (result.status !== 'success') {
                        return res.status(500).json({
                            status: result.status, message: result.errorMessage
                        });
                    }

                    await CompletePayment(result, result.basketId);


                    res.writeHead(302, { Location: `${process.env.NEXT_PUBLIC_URL}/cart` });
                    res.end();
                } catch (err) {

                    res.status(500).json({status: false, message: err.errorMessage})
                }
            }
        }

        if (query === "cart-addPayment") {
            if (method === 'POST') {

                let data = getData(req, ip);

                //BasketItems
                if (req.body.products) {
                    data.basketItems = req.body.products.map((item) => {
                        return [{
                            id: item.product._id,
                            name: item.product.title,
                            category1: item.product.category,
                            category2: item.product.category,
                            itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                            price: item.price
                        }];
                    }).flat();
                }


                try {
                    const result = await new Promise((resolve, reject) => {
                        iyzipay.checkoutFormInitialize.create(data, (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    });
                    console.log("iyzipay.checkoutFormInitialize", result)

                    if (result.status !== 'success') {
                        return res.status(500).json({success: 'fail', message: result.errorMessage});
                    }

                    if (!req.body.userId.cardUserKey) {
                        if (result?.status === "success" && result?.cardUserKey) {
                            const user = await User.findOne({_id: req.body.userId._id});
                            user.cardUserKey = result?.cardUserKey
                            data.cardUserKey = user.cardUserKey;
                            await user.save();
                        }
                    }

                        const findOrder = await Order.findOne({basketId: result.basketId});
                        if (!findOrder) {
                            await Order.create({
                                conversationId: data?.conversationId,
                                basketId: data?.basketId,
                                name: data?.buyer?.name,
                                surname: data?.buyer?.surname,
                                email: data?.buyer?.email,
                                price: data?.price,
                                status: -1,
                                completed: false,
                                paidPrice: data?.paidPrice,
                                quantity: data.basketItems.length,
                                address: {
                                    contactName: data?.billingAddress?.contactName,
                                    country: data?.billingAddress?.country,
                                    city: data?.billingAddress?.city,
                                    address1: data?.billingAddress?.address
                                },
                                productOrder: req.body.products,
                                currency: data?.currency,
                                cargo: "GKN Kargo"
                            });
                        }
                        if (findOrder?.completed) {

                            return res.status(400).json({status: false, message: "shopping basket paid more"})
                        }


                    const html = `

<!doctype html>
<html lang="en">
<head>
   <title>Ödeme Yap</title>
   <meta charset="UTF-8">
   ${result.checkoutFormContent}
</head>

</html>

                    `;


                    res.send(result.paymentPageUrl);
                } catch (err) {
                    return res.status(500).json({
                        success: 'fail', message: err.message || 'Beklenmedik bir hat ile karşılaşıldı'
                    });
                }
            }
        }

    }
}


const getData = (req, ip) => {
    let data = {
        locale: "tr",
        conversationId: req.body.shoppingCartId,
        price: req.body.total.toString(),
        paidPrice: req.body.total.toString(), // pricePayload gelicek
        currency: req.body.currency,
        basketId: req.body.shoppingCartId,//Sipariş Numarası
        paymentGroup: "PRODUCT",
        enabledInstallments: [1, 2, 3, 6, 9],
        callbackUrl: `${process.env.NEXT_PUBLIC_API_URL}/checkout/payments/complete?basketId=${encodeURIComponent(req.body.shoppingCartId)}`, ...req.body.userId.cardUserKey && {
            cardUserKey: req.body.userId?.cardUserKey
        },
        buyer: {
            id: req.body.userId._id,
            name: req.body.e_invoice.name,
            surname: req.body.e_invoice.surName,
            gsmNumber: `+90${req.body.e_invoice.phoneNumber}`,
            email: req.body.userId.email,
            identityNumber: req.body.userId._id.toString().slice(0, 11),
            lastLoginDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            registrationDate: moment(req.body.userId.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            registrationAddress: req.body.e_invoice.address,
            ip: ip,
            city: req.body.e_invoice.city,
            country: req.body.e_invoice.country,
            zipCode: "34732"

        },
        shippingAddress: {
            contactName: `${req.body.cargoAddress.name} ${req.body.cargoAddress.surName}`,
            city: req.body.cargoAddress.city,
            country: req.body.cargoAddress.country,
            address: req.body.cargoAddress.address,
            zipCode: "34732"
        },
        billingAddress: {
            contactName: `${req.body.e_invoice.name} ${req.body.e_invoice.surName}`,
            city: req.body.e_invoice.city,
            country: req.body.e_invoice.country,
            address: req.body.e_invoice.address,
            zipCode: "34732"
        }, //ALDIĞIMIZ ürünleri Listeliceğiz
        basketItems: [],
    };
    return data;
}


export default handler;