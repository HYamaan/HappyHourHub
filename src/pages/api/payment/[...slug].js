import {nanoid} from 'nanoid'
import Iyzipay from 'iyzipay';
import User from '../../../models/User';
import ShoppingCartUser from "../../../models/shoppingCartUser";
import moment from "moment";
import Order from "../../../models/Order";
import CompletePayment from "../../../utilities/payments";
import PaymentSuccess from "../../../models/payment-success";
import {ObjectId} from "mongodb";

const handler = async (req, res) => {
    const {method,} = req;
    const query = req.query.slug[0];

    const iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_PAYMENT_API_KEY,
        secretKey: process.env.IYZICO_PAYMENT_SECRET_KEY,
        uri: 'https://sandbox-api.iyzipay.com'
    });

    const userAgent = req.headers["user-agent"];

    if (query === "cart-addPayment") {
        if (method === 'POST') {
            const findUser = await User.findOne({_id:req.body.userId._id})
            let data = getData(req, findUser.ip);

            if (req.body.registerCard === "1") {
                const dataInfo = {
                    locale: data.locale,
                    conversationId: req.body.shoppingCartId,
                    email: req.body.userId.email,
                    externalId: nanoid(),
                    cardAlias: req.body.cardAlias,
                    cardHolderName: req.body.cardHolderName,
                    cardNumber: req.body.cardNumber,
                    expireMonth: req.body.expireMonth,
                    expireYear: "20" + req.body.expireYear,
                }

                await getSaveCard(dataInfo, res, iyzipay)


            }
            if (req.body.isSave === true) {
                const cart = await cardPaymentTokenIndex(res, req, iyzipay)

                data.paymentCard = {
                    cardToken: cart.cardToken,
                    cardUserKey: cart.cardUserKey
                }

            } else if (req.body.isSave === false) {
                data.paymentCard = {

                    cardHolderName: req.body.cardHolderName,
                    cardNumber: req.body.cardNumber,
                    expireMonth: req.body.expireMonth,
                    expireYear: "20" + req.body.expireYear,
                    cvc: req.body.cvc,
                    registerCard: req.body.registerCard
                }
            } else {
                return res.status(405).json({success: 'fail', message: 'Geçerli bir ödeme yöntemi giriniz'});
            }


            try {
                const result = await new Promise((resolve, reject) => {
                    iyzipay.payment.create(data, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });

                if (result.status !== 'success') {
                    return res.status(500).json({success: 'fail', message: result.errorMessage});
                }

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
                    quantity: req.body?.products.length,
                    installment: parseInt(data?.installment),
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

                await CompletePayment(result, req.body.shoppingCartId);


                return res.status(200).json({data: result, message: 'Ödeme Başarılı'});

            } catch (err) {
                return res.status(500).json({
                    success: 'fail',
                    message: err.message || 'Beklenmedik bir hat ile karşılaşıldı'
                });
            }
        }
    }
    if (query === "cart-list") {
        if (method === 'GET') {

            const user = await User.findOne({_id: req.query.userId})

            const cardUserKey = user?.cardUserKey;

            try {
                const result = await getUserCards(cardUserKey, res, iyzipay)
                return res.status(200).json({data: result.cardDetails, message: 'Ödeme Başarılı'});
            } catch (err) {
                return res.status(500).json({
                    success: 'fail',
                    message: err.message || 'Beklenmedik bir hat ile karşılaşıldı'
                });
            }
        }
    }
    if (query === "cart-save") {
        const {cardAlias, cardHolderName, cardNumber, email, expireMonth, expireYear} = req.body;
        if (method === 'POST') {
            const dataInfo = {
                cardAlias,
                cardHolderName,
                cardNumber,
                expireMonth,
                expireYear,
                email
            }
            try {
                const result = await getSaveCard(dataInfo, res, iyzipay)
                return res.status(200).json({data: result, message: 'Kart kaydedildi'});
            } catch (err) {
                return res.status(500).json({
                    success: 'fail',
                    message: err.errorMessage || 'Beklenmedik bir hat ile karşılaşıldı'
                });
            }

        }
    }
    if (query === "cart-delete-by-token") {
        if (method === "DELETE") {
            const {cardToken, email} = req.body;
            const data = {cardToken, email}
            await deleteUserCard(data, res, iyzipay)
        }
    }
    if (query === "cart-delete-by-index") {
        if (method === "DELETE") {
            const {cardUserKey} = req.body
            if (!req.query?.cardIndex) {
                return res.status(400).json({status: false, message: "Card Index is required"})
            }

            //Find User cardUserKey
            const user = await User.findOne({cardUserKey: cardUserKey});
            if (user) {
                const cardUserKey = user?.cardUserKey;

                //IYZICO cart Listesini Aldık
                const cards = await getUserCards(cardUserKey, res, iyzipay);
                const index = parseInt(req.query.cardIndex);


                //index kontrol
                if (index >= cards?.cardDetails.length) {
                    return res.status(400).json({status: false, message: "Card doesnt exists, check index number"});
                }

                const {cardToken} = cards?.cardDetails[index]
                const data = {
                    cardToken,
                    user
                }

                await deleteUserCard(data, res, iyzipay);

            } else {
                res.status(400).json({status: false, message: "You don't have any card"})
            }

        }
    }
    if (query === "payment-cart-refund") {
        if (method === "POST") {
            const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];

            const {reason, description,paymentSuccessId} = req.body;
            const {paymentTransactionId} = req.query;
            const reasonObj = {};
            if (!paymentTransactionId && !paymentSuccessId) {
                return res.status(400).json({status: false, message: "PaymentSuccessId and paymentTransactionId are required"})
            }


            //RETURN ITEM TRANSACTION
            const payment= await PaymentSuccess.findOne({_id:paymentSuccessId});
            const currentItemTransaction = payment.itemTransaction.find((item,index)=>{
                return item.paymentTransactionId===paymentTransactionId
            });

            //CONTROL ORDER FOR STATUS
            const order = await Order.findOne({paymentSuccessId: req.body.paymentSuccessId});
            if (order.status !== 0)  return res.status(400).json({status: false, message: "Your order has been shipped"})


            //RETURN PRODUCTS FOR STATUS
                //FIND INDEX
            const cancelProductIndex = order.productOrder.findIndex(product => product.product._id.toString() === currentItemTransaction.itemId.toString());
            if (cancelProductIndex === -1)  return res.status(404).json({ status: false, message: "Product not found in order" });
                //STATUS CONTROL
            if (order.productOrder[cancelProductIndex].status !== 0) return res.status(400).json({status: false, message: "Your product order has been shipped"})
            //REASON AND DESC CONTROL
            if (reason && description) {
                if (!reasonEnum.includes(reason)) {
                    return res.status(400).json({status: false, message: "Invalid payment reason"})
                }
                reasonObj.reason = reason;
                reasonObj.description = description;
            }
            //USER CONTROL
            const user=await User.findOne({email:order.email});
            if(!user)   return res.status(400).json({status: false, message: "User Not found"})
            const data = {
                locale: "tr",
                conversationId: order.conversationId,
                paymentTransactionId:paymentTransactionId,
                price:currentItemTransaction.price,
                ip:user.ip,
                currency:order.currency,
                ...reasonObj
            }

            try {
                const result = await new Promise((resolve, reject) => {
                    iyzipay.refund.create(data, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });

                if (result.status !== 'success') {
                    return res.status(500).json({
                        status: result.status,
                        message: result.errorMessage
                    });
                }else{

                    //IADE EDİLEN ÜRÜNÜN STATUS DEĞERİNİ -9 YAPTIK
                    const updatedOrder = await Order.findOneAndUpdate(
                        {
                            paymentSuccessId: req.body.paymentSuccessId,
                            'productOrder._id': order.productOrder[cancelProductIndex]._id
                        },
                        { $set: { 'productOrder.$.status': -9 } },
                        { new: true }
                    );
                }


                return res.status(200).json({data: result, message: 'İade İşlemine alındı'});
            } catch (err) {
                return res.status(500).json({
                    success: 'fail',
                    message: err.message || 'Beklenmedik bir hat ile karşılaşıldı'
                });
            }
        }
    }
    if (query === "installments") {
        if (!req.query?.userId) {
            if (method === "POST") {
                const dataInfo = {
                    binNumber: req.body,
                    price: req.body
                };
                if (!dataInfo.binNumber || !dataInfo.price) {
                    return res.status(400).json({status: false, message: "Missing Parameters"})
                }
                //FİYATA GÖRE TAKSİT KONTROLÜ
                await getInstallmentInfo(dataInfo, res, iyzipay)
            }
        } else {
            if (method === "POST") {

                const data = {
                    binNumber: req.body.binNumber,
                    userId: req.query.userId
                };
                if (!data.userId) {
                    return res.status(400).json({status: false, message: "Basket id is required."});
                }
                if (!data.binNumber) {
                    return res.status(400).json({status: false, message: "Bin number is required."});
                }

                //GET SHOPPİNG CART PRODUCTS
                const userShoppingCart = await ShoppingCartUser.findOne({userId: data.userId})
                    .populate({
                        path: "products.product",
                        model: "Product"
                    })
                    .select("products");

                const basketTotal = userShoppingCart.products.reduce((acc, curr) => {
                    const productPrice = curr.price * curr.productTotal;
                    return acc + productPrice;
                }, 0);
                if (!basketTotal) {
                    return res.status(400).json({status: false, message: "Missing parameters"});
                }

                const dataInfo = {
                    binNumber: data.binNumber,
                    price: basketTotal
                }

                //SEPET TUTARINA GÖRE TAKSİT KONTROLÜ
                await getInstallmentInfo(dataInfo, res, iyzipay)
            }
        }

    }
    if (query === "cancel") {
        const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];
        if (method === "POST") {
            const {reason, description} = req.body;
            const {paymentSuccessId} = req.query;
            const reasonObj = {};
            if (!paymentSuccessId) {
                return res.status(400).json({status: false, message: "PaymentSuccessId is required"})
            }
            const order = await Order.findOne({paymentSuccessId: req.query.paymentSuccessId})
            if (order.status !== 0) {
                return res.status(400).json({status: false, message: "Your order has been shipped"})
            }
            if (reason && description) {
                if (!reasonEnum.includes(reason)) {
                    return res.status(400).json({status: false, message: "Invalid payment reason"})
                }
                reasonObj.reason = reason;
                reasonObj.description = description;
            }
            try {
                const payment = await PaymentSuccess.findOne({_id: ObjectId(paymentSuccessId)})

                const data = {
                    locale: req.body.locale || Iyzipay.LOCALE.TR,
                    conversationId: req.body.basketId,
                    paymentId: payment?.paymentId,
                    ip: req.body.userId.ip,
                    ...reasonObj
                }

                const result = await new Promise((resolve, reject) => {
                    iyzipay.cancel.create(data, (err, result) => {
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

                return res.status(200).json({data: result});
            } catch (err) {

                res.status(500).json({status: false, message: err.errorMessage})
            }
        }
    }

};

const getUserCards = async (cardUserKey, res, iyzipay, conversationId, locale) => {
    const data = {
        locale: locale || Iyzipay.LOCALE.TR,
        conversationId: conversationId || nanoid(),
        cardUserKey
    }

    const result = await new Promise((resolve, reject) => {
        iyzipay.cardList.retrieve(data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    if (result.status !== 'success') {
        return res.status(500).json({
            status: result.status,
            message: result.errorMessage
        });
    }
    result.cardDetails.map(item => {
        item.cardUserKey = cardUserKey
    });
    return result;
}
const deleteUserCard = async (dataInfo, res, iyzipay) => {
    let user;
    if (dataInfo?.email) {
        user = await User.findOne({email: dataInfo.email});
    } else {
        user = dataInfo?.user
    }

    if (user) {
        const data = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: nanoid(),
            cardUserKey: user?.cardUserKey,
            cardToken: dataInfo.cardToken
        }
        try {
            const result = await new Promise((resolve, reject) => {
                iyzipay.card.delete(data, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            if (result.status !== 'success') {
                return res.status(500).json({
                    status: result.status,
                    message: result.errorMessage
                });
            }
            return res.status(200).json({data: result, message: 'Kart Silindi'});
        } catch (err) {
            return res.status(500).json({
                success: 'fail',
                message: err.message || 'Beklenmedik bir hat ile karşılaşıldı'
            });
        }
    } else {
        return res.status(400).json({status: false, message: "user not found"})
    }
}
const getInstallmentInfo = async (dataInfo, res, iyzipay) => {

    try {
        const data = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: nanoid(),
            binNumber: dataInfo.binNumber,
            price: dataInfo.price
        }

        const result = await new Promise((resolve, reject) => {
            iyzipay.installmentInfo.retrieve(data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        if (result.status !== 'success') {
            return res.status(500).json({
                status: result.status,
                message: result.errorMessage
            });
        }

        return res.status(200).json({data: result});
    } catch (err) {

        res.status(500).json({status: false, message: err.errorMessage})
    }
}

const getSaveCard = async (dataInfo, res, iyzipay) => {
    const user = await User.findOne({email: dataInfo.email});
    if (user) {
        try {

            const data = {
                locale: dataInfo.locale || "tr",
                conversationId: dataInfo.conversationId || nanoid(),
                email: dataInfo.email,
                externalId: dataInfo.externalId || nanoid(),
                ...(user?.cardUserKey && {cardUserKey: user?.cardUserKey?.toString()}),
                card: {
                    cardAlias: dataInfo.cardAlias,
                    cardHolderName: dataInfo.cardHolderName,
                    cardNumber: dataInfo.cardNumber,
                    expireMonth: dataInfo.expireMonth,
                    expireYear: dataInfo.expireYear,
                }
            }

            const result = await new Promise((resolve, reject) => {
                iyzipay.card.create(data, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });

            if (result.status !== 'success') {
                return res.status(500).json({
                    status: result.status,
                    message: result.errorMessage
                });
            }
            if (!user.cardUserKey) {
                if (result?.status === "success" && result?.cardUserKey) {
                    user.cardUserKey = result?.cardUserKey
                    await user.save();
                }
            }
            return result;
        } catch (err) {
            console.log(err);
        }

    } else {
        res.status(400).json({status: false, message: "user not found"})
    }
}

const getData = (req, ip) => {
    let data = {
        locale: "tr",
        conversationId: req.body.shoppingCartId,
        price: req.body.total,
        paidPrice: req.body.total, // pricePayload gelicek
        currency: req.body.currency,
        installment: '1', // TAKSİTLENDİRME DEĞERLERİ
        basketId: req.body.shoppingCartId,//Sipariş Numarası
        paymentChannel: "WEB",
        paymentGroup: "PRODUCT",

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

        },
        shippingAddress: {
            contactName: `${req.body.cargoAddress.name} ${req.body.cargoAddress.surName}`,
            city: req.body.cargoAddress.city,
            country: req.body.cargoAddress.country,
            address: req.body.cargoAddress.address,
        },
        billingAddress: {
            contactName: `${req.body.e_invoice.name} ${req.body.e_invoice.surName}`,
            city: req.body.e_invoice.city,
            country: req.body.e_invoice.country,
            address: req.body.e_invoice.address
        },
        //ALDIĞIMIZ ürünleri Listeliceğiz
        basketItems: req.body?.products?.map((item) => {
            return [{
                id: item.product._id,
                name: item.product.title,
                category1: item.product.category,
                category2: item.product.category,
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: item.price
            }]
        }).flat() || [],
    };
    return data;
}
const cardPaymentTokenIndex = async (res, req, iyzipay) => {
    const getCardUserKey = await User.findOne({_id: req.body.userId._id})
    if (!getCardUserKey) {
        return res.status(404).json({status: false, message: "User not found."})
    }
    const cardUserKey = getCardUserKey?.cardUserKey;
    const cardList = await getUserCards(cardUserKey, res, iyzipay)

    //index kontrol
    const index = parseInt(req.query.cardIndex);
    if (index >= cardList?.cardDetails.length) {
        return res.status(400).json({status: false, message: "Card doesnt exists, check index number"});
    }
    const cardToken = cardList?.cardDetails[index].cardToken;


    return {cardToken, cardUserKey}


}
export default handler;



