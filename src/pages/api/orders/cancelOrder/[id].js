import dbConnect from "../../../../utilities/dbConnect";
import CancelOrder from "../../../../models/cancelCustomerOrder"


const handler = async (req, res) => {
    await dbConnect();
    const {method,query:{id}} = req;
    console.log("req.query")
    if (method === "GET") {
        try{
            const cnOrder = await CancelOrder.find({
                order:id
            }) .populate({
                path: "order",
                model: "Order"
            });

            if(cnOrder.length<1){

                res.status(400).json({status:false})
            }else{
                res.status(200).json(cnOrder);
            }

        }catch (err){
            console.log(err);
        }
    }
    if (method === "POST") {
        try{
            const data = {
                order:id,
                ...req.body
            }
            const newCancelOrder = await CancelOrder.create(data);
            res.status(201).json(newCancelOrder);
        }catch (err){
            console.log(err);
        }
    }
    if (method === "PATCH") {
        try {
            console.log("id",id)
            const cancelOrders = await CancelOrder.findOneAndUpdate(
                { order: id },
            {$set:{cancelStatus:true}}
            )



            res.status(200).json(cancelOrders);
        } catch (err) {
            console.log(err);
        }
    }

}
export default handler;

