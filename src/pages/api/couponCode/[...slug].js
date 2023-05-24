import dbConnect from "../../../utilities/dbConnect";
import CouponCode from '../../../models/CouponCode';

export default async function handler(req, res) {
    // Veritabanına bağlan
    await dbConnect();
    const {method}=req;
    const slug = req.query.slug[0];

    if(slug === "get-coupon-code"){
        if (method==="GET"){
            try {
                const coupons = await CouponCode.find().populate({
                    path:"productId",
                    model:"Product"
                });
                return res.status(200).json(coupons);
            }catch (err){
                console.log(err);
            }
        }
    }
    if(slug === "add-coupon-code"){

        if(method === "POST"){

            const today = new Date();
            today.setDate(today.getDate() + parseInt(req.body.date));
            let  newCouponCode;
            if(req.body?.productId){
                newCouponCode = await  new CouponCode({
                    code:req.body.code,
                    productId:req.body.productId,
                    expiryDate:today
                });
            }else{

                newCouponCode = await  new CouponCode({
                    code:req.body.code,
                    discountAmount:req.body.discountAmount,
                    expiryDate:today
                });
            }
            await newCouponCode.save();
            res.status(200).json({status:true,message:"Created coupon code"})
        }
    }
    if(slug === "search-coupon-code"){
        if (req.method === 'POST') {
            try {

                const { couponCode } = req.body;


                const coupon = await CouponCode.findOne({ code: couponCode }).populate({
                    path:"productId",
                    model:"Product"
                });
                if (!coupon) {
                    return res.status(404).json({ status:false,error: 'Geçersiz kupon kodu' });
                }
                if (coupon.expiryDate < new Date()) {
                    return res.status(400).json({ success: false, message: "Bu kupon kodu artık geçerli değil" });
                }

                if(coupon?.productId){
                   const  productId = coupon?.productId
                    return res.status(200).json({ success: true, productId: productId ,couponId:coupon._id});
                }else if(coupon?.discountAmount){
                   const discountAmount=coupon.discountAmount;
                    return res.status(200).json({ success: true, discountAmount: discountAmount ,couponId:coupon._id});
                }else {
                    return res.status(400).json({ success: false, message: "Bu kupon kodu için geçerli bir indirim bulunamadı" });
                }
            } catch (error) {
                res.status(500).json({ error: 'Bir hata oluştu' });
            }
        } else {
            res.status(400).json({ error: 'Geçersiz istek' });
        }
    }
    if(slug === "delete-coupon-code"){
        if(method==="DELETE"){
            try {

               if(req.query.deleteId){
                   await CouponCode.findByIdAndDelete(req.query.deleteId);
               }
            }catch (err){
                res.status(400).json({status:false,message:"Beklenmeyen bir hata meydana geldi."})
            }
        }
    }



}
