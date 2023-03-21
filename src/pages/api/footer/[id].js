import Footer from "../../../models/Footer";
import dbConnect from "../../../utilities/dbConnect";

const handler = async (req,res)=>{
    await dbConnect();

    const {method,query:{id}} =req;
    if(method === "GET"){
        try {
            const footer = await Footer.findById(id);
            res.status(200).json(footer);
        }catch (err){
            console.log(err);
        }
    }
    if(method === "PUT"){
        try {
            const newFooter = await Footer.findByIdAndUpdate(id,req.body,{new:true});
            res.status(201).json(newFooter);
        }catch (err){
            console.log(err);
        }
    }
}
export default handler;