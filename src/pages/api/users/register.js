import dbConnect from "../../../utilities/dbConnect";
import User from "../../../models/User"
import bcrypt from "bcryptjs"


const handler = async (req, res) => {
    if (req.method === "POST") {
        await dbConnect();
            const body = req.body;

        if (!body) return res.status(404).json({error: "Don't have form data..."});

        const user = await User.findOne({email: body.email});
        if (user) {
            res.status(400).json({message: "User is valid"});
            return;
        }
        const newUser = await new User(body);
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        newUser.confirmPassword = await bcrypt.hash(newUser.confirmPassword, salt);

        await newUser.save();
        res.status(200).json(newUser);
    }


    // User.create({password:await bcrypt.hash(password,12),
    //              confirmPassword:await bcrypt.hash(confirmPassword,12)},
    //              function (err,data){
    //              if (err) return res.status(404).json({status:true,user:data});
    // })
}
export default handler;

