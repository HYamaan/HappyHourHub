import UserComments from "../../../models/UserComments";
import dbConnect from "../../../utilities/dbConnect";
import AdminControlComments from "../../../models/AdminControlComments";


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

    if (method === "DELETE") {
        try {
            const adminControlComment= await AdminControlComments.findOne({
                userCommentsTable:id
            });
            if(adminControlComment){
                await AdminControlComments.findByIdAndDelete(adminControlComment._id)
            }

            const categoryDelete= await UserComments.findByIdAndDelete(id);
            res.status(200).json(categoryDelete);

        }catch (err){
            console.log(err);
        }
    }
}
export default handler;