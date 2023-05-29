import dbConnect from "../../../utilities/dbConnect";
import Orders from "../../../models/Order"
import PaymentSuccess from "../../../models/payment-success";

const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;

    if (method === "GET") {
        try{
            let orders;
            if("paymentId" in req.query){
                const paymentSuccess = await PaymentSuccess.find({paymentId:req.query.paymentId});
                orders = await Orders.find({paymentSuccessId:paymentSuccess[0]._id});
            }else{
                orders = await Orders.find();
            }

            res.status(200).json(orders);
        }catch (err){
            console.log(err);
        }
    }
    if (method === "POST") {
        try{
            const newOrders = await Orders.create(req.body);
            res.status(201).json(newOrders);
        }catch (err){
            console.log(err);
        }
    }
}
export default handler;

