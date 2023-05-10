

import User from "../../../models/User";
import dbConnect from "../../../utilities/dbConnect";
import crypto from "crypto";
import userVerifyCodeEmail from "../../../hooks/userVerifyCodeEmail";
const handler = async (req, res) => {
    await dbConnect();
    const {method, query: { id:verifyCode }} = req;

    if(method==="PATCH"){
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
        if (user && user.emailVerifiedToken) {
            const hashedInput = crypto.createHash("sha256").update(req.body.verifyCode).digest("hex");
            const isMatch = (hashedInput === user.emailVerifiedToken);
            if (isMatch) {

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
    if(method==="POST"){
        try {
            const user = await User.findOne({
                emailVerifiedToken:verifyCode
            }).select("+emailVerifiedToken")
                .select('+emailVerifiedExpires');
            if(!user){
                throw new Error('You have applied an activation code!')

            }else{
                await userVerifyCodeEmail(req,res,user);
            }

        }catch (err){
            res.status(400).json(err.message)
        }
    }
};

export default handler;