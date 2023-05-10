import dbConnect from "../../../utilities/dbConnect";
import User from "../../../models/User"

import userVerifyCodeEmail from "../../../hooks/userVerifyCodeEmail";


const handler = async (req, res) => {
    if (req.method === "POST") {
        await dbConnect();
        const body = req.body;

        if (!body) return res.status(404).json({error: "Don't have form data..."});
        //creat user for DB
        const user = await User.findOne({email: body.email});
        if (user) {
            res.status(400).json({message: "User is valid"});
            return;
        }

        const newUser = await new User(body);

        await newUser.save({ validateBeforeSave: false });
        await userVerifyCodeEmail(req,res,newUser)


    }
}
export default handler;

