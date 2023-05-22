import {nanoid} from 'nanoid'
import Iyzipay from 'iyzipay';
import User from '../../../models/User';
import ShoppingCartUser from "../../../models/shoppingCartUser";
import moment from "moment";
import Order from "../../../models/Order";
import CompletePayment from "../../../utilities/payments";
import {fi} from "timeago.js/lib/lang";

const handler = async (req,res)=> {
    const {method} = req;
    const query = req.query.slug[1];
    const ip = req.connection.remoteAddress || req.headers["x-forwarded-for"];
    const userAgent = req.headers["user-agent"];

    const iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_PAYMENT_API_KEY,
        secretKey: process.env.IYZICO_PAYMENT_SECRET_KEY,
        uri: 'https://sandbox-api.iyzipay.com'
    });



   if(req.query.slug[0] === "payments"){


       if(req.query.slug[1] === "complete"){
                if(method === "POST"){
                    if(!req.body?.paymentId){
                        return res.status(400).json({status:false,message:"Payment id is required"})
                    }
                    if(req.body.status !== "success"){
                        return res.status(400).json({status:false,message:"Payment cant be starred because initialization is failed"})
                    }
                    try {
                        const data = {
                            locale: req.body.locale|| Iyzipay.LOCALE.TR,
                            conversationId: req.body.conversationId,
                            paymentId: req.body.paymentId,
                            conversationData:req.body.conversationData
                        }

                        const result = await new Promise((resolve, reject) => {
                            iyzipay.threedsPayment.create(data, (err, result) => {
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

                        await CompletePayment(result,req.query.basketId);

                        return res.status(200).json({data: result});
                    } catch (err) {

                        res.status(500).json({status: false, message: err.errorMessage})
                    }
                }
           }

       if (query === "cart-addPayment") {
           if (method === 'POST') {

               let data = getData(req,ip);
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
               };

               if (req.body.registerCard === "1") {
                   const dataInfo = {
                       locale: data.locale,
                       conversationId: req.body.shoppingCartId,
                       email: req.body.userId.email,
                       externalId: nanoid(),
                       cardAlias: req.body.cardHolderName,
                       cardHolderName: req.body.cardHolderName,
                       cardNumber: req.body.cardNumber,
                       expireMonth: req.body.expireMonth,
                       expireYear: "20" + req.body.expireYear,
                   }

           await getSaveCard(dataInfo, res, iyzipay)

               }
               if (req.body.isSave === true ) {
                   const cart=await cardPaymentTokenIndex(res,req,iyzipay)

                   data.paymentCard = {
                       cardToken:cart.cardToken,
                       cardUserKey: cart.cardUserKey
                   }

               } else if (req.body.isSave === false ) {
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
                       iyzipay.threedsInitialize.create(data, (err, result) => {
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

                   const findOrder = await Order.findOne({basketId:data.basketId});
                   console.log("findOrder",findOrder)
                   if(!findOrder){
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
                           cargoPrice:data?.cargoPrice,
                           couponCodePrice:data?.couponCode,
                           couponId:data?.couponId,
                           quantity: req.body?.products.length,
                           installment: parseInt(data?.installment),
                           e_invoiceAddress: {
                               contactName: data?.billingAddress?.contactName,
                               country: data?.billingAddress?.country,
                               city: data?.billingAddress?.city,
                               address1: data?.billingAddress?.address
                           },
                           cargoAddress:{
                               contactName: data?.shippingAddress?.contactName,
                               country: data?.shippingAddress?.country,
                               city: data?.shippingAddress?.city,
                               address1: data?.shippingAddress?.address
                           },
                           productOrder: req.body.products,
                           currency: data?.currency,
                           cargo: "GKN Kargo"
                       });
                   }
                   if(findOrder?.completed){
                       return res.status(400).json({status:false,message:"shopping basket paid more"})
                   }
                   console.log("res",result)
                   const html = Buffer.from(result.threeDSHtmlContent,"base64").toString();
                   console.log("html",html)
                   res.send(html);


               } catch (err) {
                   return res.status(500).json({
                       success: 'fail',
                       message: err.message || 'Beklenmedik bir hat ile karşılaşıldı'
                   });
               }
           }
       }

   }
}


const getData = (req,ip)=>{
    let data = {
        locale: "tr",
        conversationId: req.body.shoppingCartId,
        price: req.body.total.toString(),
        paidPrice: req.body.paidPrice.toString(), // pricePayload gelicek
        cargoPrice:req.body?.cargoPrice,
        couponCode:req.body?.couponCode,
        couponId:req.body?.couponName,
        currency: req.body.currency,
        installment: '1', // TAKSİTLENDİRME DEĞERLERİ
        basketId: req.body.shoppingCartId,//Sipariş Numarası
        paymentChannel: "WEB",
        paymentGroup: "PRODUCT",
        callbackUrl :`${process.env.NEXT_PUBLIC_API_URL}/payment_threeds/payments/complete?basketId=${encodeURIComponent(req.body.shoppingCartId)}`,
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
        basketItems: [],
    };
    return data;
}
const getUserCards = async (cardUserKey, res, iyzipay,conversationId,locale) => {
    const data = {
        locale:locale || Iyzipay.LOCALE.TR,
        conversationId:conversationId || nanoid(),
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
const cardPaymentTokenIndex = async (res,req,iyzipay)=>{
    const getCardUserKey= await User.findOne({_id:req.body.userId._id})
    if(!getCardUserKey){
        return res.status(404).json({status:false,message:"User not found."})
    }
    const cardUserKey = getCardUserKey?.cardUserKey;
    const cardList = await getUserCards(cardUserKey, res, iyzipay)

    //index kontrol
    const index = parseInt(req.query.cardIndex);
    if (index >= cardList?.cardDetails.length) {
        return res.status(400).json({status: false, message: "Card doesnt exists, check index number"});
    }
    const cardToken = cardList?.cardDetails[index].cardToken;


    return {cardToken,cardUserKey}



}
export default handler;