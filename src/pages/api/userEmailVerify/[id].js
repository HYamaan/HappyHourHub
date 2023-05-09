

import User from "../../../models/User";
import dbConnect from "../../../utilities/dbConnect";
import crypto from "crypto";
const handler = async (req, res) => {
    await dbConnect();
    const {method, query: { id:verifyCode }} = req;

    if(method==="PATCH"){
        console.log("PATCH",req.query)
        if (!req.body.verifyCode ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide verify Code.'
            });
        }
        const user = await User.findOne(
            {
                emailVerifiedToken: verifyCode,
                emailVerifiedExpires: {$gt: Date.now()}})
            .select('+emailVerifiedToken')
            .select('+emailVerifiedExpires');
        console.log("user",user)
        console.log(user)
        if (user && user.emailVerifiedToken) {
            const hashedInput = crypto.createHash("sha256").update(req.body.verifyCode).digest("hex");
            const isMatch = (hashedInput === user.emailVerifiedToken);
            if (isMatch) {
                console.log("___________-----____",isMatch)
                try {
                    await User.findByIdAndUpdate(user._id,{
                        emailVerified: true,
                        $unset: {
                            emailVerifiedToken: "",
                            emailVerifiedExpires: ""
                        }
                    },{new:true})

                    return res.status(200).json({success:true,message:"Activation code sent to your mailbox."});
                } catch (err){
                    console.log(err);
                    return res.status(500).json({success: false, error: err.message});
                }
            } else {
                return res.status(400).json({success: false, message: ' You have entered a failed code.'});
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'There is no user with the specified verify code.'
            });
        }


    }
};

export default handler;