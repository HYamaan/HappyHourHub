import Admin from "../../../models/admin";
import dbConnect from "../../../utilities/dbConnect";

const handler = async (req,res)=>{
    await dbConnect();

    const {method} =req;
    if(method === "GET"){
        try {
            const admin = await Admin.find({
                name:"admin"
            });
            res.status(200).json(admin);
        }catch (err){
            console.log(err);
        }
    }
    // if(method === "POST"){
    //     try {
    //         const newAdmin = await Admin.create(req.body)
    //         res.status(201).json(newAdmin);
    //     }catch (err){
    //         console.log(err);
    //     }
    // }
}
export default handler;