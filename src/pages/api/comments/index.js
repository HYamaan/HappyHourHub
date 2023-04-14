import dbConnect from "../../../utilities/dbConnect";
import UserComments from "../../../models/UserComments"
import User from "../../../models/User";
const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;

    if (method === "GET") {
        try{
            const userComments = await UserComments.find()
                .populate({
                    path:"userId",
                    model:"User"
                });
            res.status(200).json(userComments);
        }catch (err){
            console.log(err);
        }
    }
    if (method === "POST") {
        try{
            const newUserComments = await UserComments.create(req.body);
            res.status(201).json(newUserComments);
        }catch (err){
            console.log(err);
        }
    }
}
export default handler;

