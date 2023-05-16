
import Iyzipay from 'iyzipay';
import Payment from '../../../models/payment';

const handler = async (req, res) => {
    const {method,} = req;
    const query=  req.query.slug[0]
    const iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_PAYMENT_API_KEY,
        secretKey: process.env.IYZICO_PAYMENT_SECRET_KEY,
        uri: 'https://sandbox-api.iyzipay.com'
    });

    if (query === "payment-cart-addPayment"){
        const {  cardToken, cardUserKey, isSave} = req.body;
        const ip = req.connection.remoteAddress === '::1' ? "127.0.0.1": req.connection.remoteAddress;

        const basketItems= req.body.products.map((item)=>{
            return   [{
                id: item.sku,
                name: item.product.title,
                category1: item.product.category,
                category2: item.product.category,
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: item.price
            }]
        })

            const registrationDateFormat = (dateString) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                const seconds = String(date.getSeconds()).padStart(2, "0");

                return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
            };

        const newDate = registrationDateFormat(new Date());
        const registrationDate = registrationDateFormat(new Date(req.body.userId.createdAt));
        console.log("regres",registrationDate)

        if (method === 'POST') {

            let data = {
                locale: "tr",
                conversationId: req.body.orderNo,
                price: req.body.total.toString(),
                paidPrice: req.body.total.toString(), // pricePayload gelicek
                currency: "TRY",
                installment: '1', // TAKSİTLENDİRME DEĞERLERİ
                basketId:  req.body.orderNo,//Sipariş Numarası
                paymentChannel: "WEB",
                paymentGroup: "PRODUCT",

                buyer: {
                    id: req.body.userId._id,
                    name: req.body.e_invoice.name,
                    surname: req.body.e_invoice.surName,
                    gsmNumber: `+9${req.body.e_invoice.phoneNumber}`,
                    email: req.body.e_invoice.email,
                    identityNumber: req.body.userId._id,
                    lastLoginDate: newDate,
                    registrationDate: registrationDate,
                    registrationAddress: req.body.e_invoice.address,
                    ip: ip,
                    city:  req.body.e_invoice.city,
                    country: req.body.e_invoice.country,

                },
                shippingAddress: {
                    contactName: `${req.body.cargoAddress.name } ${req.body.cargoAddress.surName}`,
                    city: req.body.cargoAddress.city,
                    country: req.body.cargoAddress.country,
                    address: req.body.cargoAddress.address,
                },
                billingAddress: {
                    contactName: `${req.body.e_invoice.name } ${req.body.e_invoice.surName}`,
                    city: req.body.e_invoice.city,
                    country: req.body.e_invoice.country,
                    address: req.body.e_invoice.address
                },
                //ALDIĞIMIZ ürünleri Listeliceğiz
                basketItems: basketItems.flat()

            };
            if (isSave === true && cardToken && cardUserKey) {
                data.paymentCard = {
                    cardToken,
                    cardUserKey
                }
            }
            else if (isSave === false) {

                data.paymentCard = {
                    cardHolderName:req.body.cardHolderName,
                    cardNumber:req.body.cardNumber,
                    expireMonth: req.body.expireMonth,
                    expireYear: "20"+req.body.expireYear,
                    cvc:req.body.cvc,
                    registerCard:req.body.registerCard
                }
            } else {
                return res.status(405).json({success: 'fail', message: 'Geçerli bir ödeme yöntemi giriniz'});
            }
            console.log("data",data)
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
                console.log("result",result)
                if (result.status !== 'success') {
                    return res.status(500).json({success: 'fail', message: result.errorMessage});
                }
                const saveData = new Payment({
                    sendData: data,
                    resultData: result
                });

                await saveData.save().catch((err)=>console.log(err))
                return res.status(200).json({data: result, message: 'Ödeme Başarılı'});
            } catch (err) {
                return res.status(500).json({
                    success: 'fail',
                    message: err.message || 'Beklenmedik bir hat ile karşılaşıldı'
                });
            }
        }
    }
     if(query === "payment-cart-list"){
        const {cardUserKey} = req.body;
        if (method === 'POST') {
            try {
                const result = await new Promise((resolve, reject) => {
                    iyzipay.cardList.retrieve({cardUserKey}, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
                if (result.status !== 'success') {
                    return res.status(500).json({
                        status:result.status,
                        message: result.errorMessage });
                }
                result.cardDetails.map(item=>{item.cardUserKey=cardUserKey});

                return res.status(200).json({ data: result.cardDetails, message: 'Ödeme Başarılı' });
            } catch (err) {
                return res.status(500).json({ success: 'fail', message: err.message || 'Beklenmedik bir hat ile karşılaşıldı' });
            }
        }
    }
     if(query === "payment-cart-save"){
         const {cardAlias,cardHolderName,cardNumber,email}=req.body;

        if (method === 'POST') {
            const data={
                locale:"tr",
                conversationId:"761f8a2c-a3ed-4444-89c8-427fd5964499",
                email,
                externalId:"645ade708d62607bc967d56c",
                ...req.body.cardUserKey && {
                    cardUserKey:req.body.cardUserKey
                },
                card:{
                    cardAlias,
                    cardHolderName,
                    cardNumber,
                    expireMonth: req.body.expireMonth,
                    expireYear: req.body.expireYear,
                }
            }

            try {
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
                        status:result.status,
                        message: result.errorMessage });
                }
                return res.status(200).json({ data: result, message: 'Kart kaydedildi' });
            } catch (err) {
                return res.status(500).json({ success: 'fail', message: err.message || 'Beklenmedik bir hat ile karşılaşıldı' });
            }
        }
    }
     if(query === "payment-cart-delete"){
        const {cardUserKey,cardToken}=req.body;
        const data={
            locale:"tr",
            conversationId:"761f8a2c-a3ed-4444-89c8-427fd5964499",
            cardUserKey,
            cardToken
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
                     status:result.status,
                     message: result.errorMessage });
             }
             return res.status(200).json({ data: result, message: 'Kart Silindi' });
         } catch (err) {
             return res.status(500).json({ success: 'fail', message: err.message || 'Beklenmedik bir hat ile karşılaşıldı' });
         }
     }
     if(query === "payment-cart-refund"){
         const {paymentTransactionId,price,ip}=req.body;
         const data={
             locale:"tr",
             conversationId:"761f8a2c-a3ed-4444-89c8-427fd5964499",
             paymentTransactionId,
             price,
             ip
         }
         try{
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
                     status:result.status,
                     message: result.errorMessage });
             }
             return res.status(200).json({ data: result, message: 'İade İşlemine alındı' });
         } catch (err) {
             return res.status(500).json({ success: 'fail', message: err.message || 'Beklenmedik bir hat ile karşılaşıldı' });
         }
     }

};

export default handler;

