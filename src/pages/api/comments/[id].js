import UserComments from "../../../models/UserComments";
import dbConnect from "../../../utilities/dbConnect";
import User from "../../../models/User";


const handler = async (req,res)=>{
    await dbConnect();

    const {method,query:{id}} =req;
    if(method === "GET"){
        try {
            const footer = await UserComments.findById(id);
            res.status(200).json(footer);
        }catch (err){
            console.log(err);
        }
    }
    if(method === "PUT") {
        try {
            const userControl = await User.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.status(200).json(userControl);
        } catch (err) {
            console.log(err);
        }
    }
    if (method === "DELETE") {
        try {
            const categoryDelete= await UserComments.findByIdAndDelete(id);
            res.status(200).json(categoryDelete);

        }catch (err){
            console.log(err);
        }
    }
}
export default handler;