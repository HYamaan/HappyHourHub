import dbConnect from "../../../utilities/dbConnect";
import Orders from "../../../models/Order"

const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;

    if (method === "GET") {
        try{
            const orders = await Orders.find();
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

