import dbConnect from "../../../utilities/dbConnect";
import UserComments from "../../../models/UserComments"

const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;

    if (method === "GET") {
        try{
            const orders = await UserComments.find();
            res.status(200).json(orders);
        }catch (err){
            console.log(err);
        }
    }
    if (method === "POST") {
        try{
            const newOrders = await UserComments.create(req.body);
            res.status(201).json(newOrders);
        }catch (err){
            console.log(err);
        }
    }
}
export default handler;

