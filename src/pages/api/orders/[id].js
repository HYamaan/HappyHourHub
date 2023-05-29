import dbConnect from "../../../utilities/dbConnect";
import Orders from "../../../models/Order"



const handler = async (req, res) => {
    await dbConnect();
    const {method, query:{id}} = req;

    if (method === "GET") {
        console.log("req.query",req.query)
        try {
            let orders;
            if("email" in req.query){
                orders = await Orders.find({email:req.query.email});
            } else{
                orders = await Orders.findById(id);
            }


            res.status(200).json(orders);
        } catch (err) {
            console.log(err);
        }
    }
    if (method === "PUT") {
        try {

            const ordersUpdate = await Orders.findByIdAndUpdate(id,
                {
                    $set:{
                        status:req.body.status,
                        "productOrder.$[].status": req.body.status
                    },
                }
                ,{new:true});

            res.status(200).json(ordersUpdate);
        } catch (err) {
            console.log(err);
        }
    }
    if(method === "PATCH"){
            if("comment" in req.query){
                let boolValue = (/true/i).test(req.query.comment);
                const ordersUpdate = await Orders.findByIdAndUpdate(id,
                    {
                        $set:{
                            isComment:boolValue,
                        },
                    }
                    ,{new:true});

                res.status(200).json(ordersUpdate);
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