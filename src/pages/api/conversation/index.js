import Conversation from "../../../models/Conversation";
import dbConnect from "../../../utilities/dbConnect";

const handler = async (req,res)=>{
    await dbConnect();

    const {method} =req;
    if(method === "GET"){
        try {
            const conversation = await Conversation.find();
            res.status(200).json(conversation);
        }catch (err){
            console.log(err);
        }
    }

    if(method === "POST"){
        try {
            const newConversation = await Conversation({
                members:[req.body.senderId,"64544ef8c371eea46a783eff"], //receiverId kısmı gelicektir
                fullName:req.body.fullName,
                userEmail:req.body.userEmail,
                topic:req.body.topic
            });
    try {
        const savedConversation = await newConversation.save();
        res.status(201).json(savedConversation)
    }catch (err){
        res.status(500).json({success:false,message:err.message})
    }

        }catch (err){
            console.log(err);
        }
    }
}
export default handler;