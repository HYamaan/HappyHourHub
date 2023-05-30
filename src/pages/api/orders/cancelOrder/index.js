import dbConnect from "../../../../utilities/dbConnect";
import CancelOrder from "../../../../models/cancelCustomerOrder"



const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;

    if (method === "GET") {
        try{
            let orders;
                if("cancelStatus" in req.query){
                    console.log("Burada1")
                    orders = await CancelOrder.find({
                        cancelStatus:false
                    }).populate({
                        path: "order",
                        model: "Order"
                    });
                }else{

                    orders = await CancelOrder.find().populate({
                        path: "order",
                        model: "Order"
                    });
                }


            res.status(200).json(orders);
        }catch (err){
            console.log(err);
        }
    }
}
export default handler;

