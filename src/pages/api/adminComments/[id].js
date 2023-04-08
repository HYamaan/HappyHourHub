import AdminControlComments from "../../../models/AdminControlComments";
import dbConnect from "../../../utilities/dbConnect";
import bcrypt from "bcryptjs";
import User from "../../../models/User";


const handler = async (req,res)=>{
    await dbConnect();

    const {method,query:{id}} =req;
    if(method === "GET"){
        try {
            const adminControl = await AdminControlComments.findById(id);
            res.status(200).json(adminControl);
        }catch (err){
            console.log(err);
        }
    }

    if (method === "PUT") {
        try {
            const users = await User.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.status(200).json(users);
        } catch (err) {
            console.log(err);
        }
    }

    if (method === "DELETE") {
        try {
            const categoryDelete= await AdminControlComments.findByIdAndDelete(id);
            res.status(200).json(categoryDelete);

        }catch (err){
            console.log(err);
        }
    }
}
export default handler;