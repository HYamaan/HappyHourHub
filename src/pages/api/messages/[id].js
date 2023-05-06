import Message from "../../../models/Message";
import dbConnect from "../../../utilities/dbConnect";

const handler = async (req,res)=>{
    await dbConnect();

    const {method,query:{id} } =req;
    if(method === "GET"){
        try {
            const message = await Message.find({
                conversationId :id
            });
            res.status(200).json(message);
        }catch (err){
            console.log(err);
        }
    }
    if(method==="DELETE"){
        try {
            const conversationIdDelete=await Message.deleteMany({ conversationId :id})
            res.status(200).json(conversationIdDelete);
        }catch (err){
            console.log(err);
        }
    }

}
export default handler;