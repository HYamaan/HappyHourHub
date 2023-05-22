import dbConnect from "../../../utilities/dbConnect";
import Orders from "../../../models/Order"


const handler = async (req, res) => {
    await dbConnect();
    const {method, query:{id}} = req;

    if (method === "GET") {
        try {
            let orders;
            if("email" in req.query){
                orders = await Orders.find({email:req.query.email});
            }else{
                orders = await Orders.findById(id);
            }


            res.status(200).json(orders);
        } catch (err) {
            console.log(err);
        }
    }
    if (method === "PUT") {
        try {
            const ordersUpdate = await Orders.findByIdAndUpdate(id,req.body,{new:true});
            res.status(200).json(ordersUpdate);
        } catch (err) {
            console.log(err);
        }
    }
    if (method === "DELETE") {
        try {
            const ordersDelete= await Orders.findByIdAndDelete(id);
            res.status(200).json(ordersDelete);

        }catch (err){
            console.log(err);

        }
    }



};

export default handler;