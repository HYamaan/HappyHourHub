import crypto from "crypto";
import User from "../models/User";
import {render} from "@react-email/render";
import EmailVerify from "../libs/EmailTemplate/EmailVerify";
import sendEmail from "../utilities/nodeEmail";


const userVerifyCodeEmail =async (req,res,newUser)=>{

    // Generate a new email verification token
    let randomNumber = Math.floor(Math.random() * 1000000) + 100000;
    let emailVerifiedToken = crypto
        .createHash("sha256")
        .update(randomNumber.toString())
        .digest("hex");
    let emailVerifiedExpires = Date.now() + 10 * 60 * 60 * 1000;

    // Check if the generated token already exists in the database
    let existingUser = await User.findOne({
        emailVerifiedToken: emailVerifiedToken,
    });

    while (existingUser) {
        randomNumber = Math.floor(Math.random() * 1000000) + 100000;
        emailVerifiedToken = crypto
            .createHash("sha256")
            .update(randomNumber.toString())
            .digest("hex");
        emailVerifiedExpires = Date.now() + 10 * 60 * 60 * 1000;

        existingUser = await User.findOne({
            emailVerifiedToken: emailVerifiedToken,
        });
    }

    newUser.emailVerifiedToken = emailVerifiedToken;
    newUser.emailVerifiedExpires = emailVerifiedExpires;



    try {
        const resetURL = `http://${req.headers.host}/auth/verifyCode?verifyCode=${newUser.emailVerifiedToken}`;
        const message = render(<EmailVerify validationCode={randomNumber} loginUrl={resetURL}/>)
        await sendEmail({
            email: newUser.email,
            subject: 'Your verify Code reset token (valid for 10 hour)',
            text: "new verify Code",
            message
        });
        await newUser.save({validateBeforeSave: false});
        res.status(200).json(newUser);

    } catch (err) {
        newUser.emailVerifiedToken = undefined;
        newUser.emailVerifiedExpires = undefined;
        await newUser.save();
        // User.findByIdAndUpdate fonksiyonu kullanmamız halinde model shcema kısmında .pre kısımları çalışmaz. getResetToken,getResetDate çalışamaz.
        return res.status(500).json({
            success: false,
            message: 'There was an error sending the email. Try again later!',
            status: 'fail'
        });
    }

}
export default userVerifyCodeEmail;