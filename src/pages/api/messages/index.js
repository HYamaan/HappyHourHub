import Message from "../../../models/Message";
import dbConnect from "../../../utilities/dbConnect";

const handler = async (req, res) => {
    await dbConnect();

    const {method} = req;
    if (method === "GET") {
        try {
            const message = await Message.find();
            res.status(200).json(message);
        } catch (err) {
            console.log(err);
        }
    }

    if (method === "POST") {
        try {
            const newMessage = await Message({
                conversationId:req.body.conversationId,
                sender:req.body.senderId,
                text:req.body.text
            });

            try {
                const savedMessage = await newMessage.save();
                res.status(201).json(savedMessage)
            }catch (err){
                res.status(500).json({success:false,message:err.message})
            }

        } catch
            (err) {
            res.status(500).json({success:false,message:err.message})
            console.log(err);
        }
    }
}
export default handler;