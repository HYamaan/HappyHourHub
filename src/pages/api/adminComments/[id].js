import AdminControlComments from "../../../models/AdminControlComments";
import dbConnect from "../../../utilities/dbConnect";



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