import dbConnect from "../../../utilities/dbConnect";
import Category from "../../../models/Category"

const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;

    if (method === "GET") {
    try{
        const users = await Category.find();
        res.status(200).json(users);
    }catch (err){

        console.log(err);
    }
    }
    if (method === "POST") {
        try{
            const newUsers = await Category.create(req.body);
            res.status(200).json(newUsers);
        }catch (err){
            console.log(err);
        }
    }
}
export default handler;

