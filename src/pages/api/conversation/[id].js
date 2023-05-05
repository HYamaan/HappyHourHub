import Conversation from "../../../models/Conversation";
import dbConnect from "../../../utilities/dbConnect";

const handler = async (req,res)=>{
    await dbConnect();

    const {method,query:{id}} =req;
    if(method === "GET"){

        try {
            const conversation = await Conversation.find({
                members:{$in:[id]}
            });
            res.status(200).json(conversation);
        }catch (err){
            console.log(err);
        }
    }
    if(method==="DELETE"){
        try {
            const conversationIdDelete=await Conversation.findByIdAndDelete(id)
            res.status(200).json(conversationIdDelete);
        }catch (err){
            console.log(err);
        }
    }

}
export default handler;