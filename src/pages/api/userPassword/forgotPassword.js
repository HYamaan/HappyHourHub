import dbConnect from "../../../utilities/dbConnect";
import User from "../../../models/User"
import { render } from '@react-email/render';
import sendEmail from "../../../utilities/nodeEmail"
import {HappyHourHubResetPasswordEmail} from "../../../libs/EmailTemplate";

const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;

    if (method === "POST") {
        try{
            const user = await User.findOne({email:req.body.email}).select('+passwordResetToken,+passwordResetExpires');
            if(!user){
                res.status(404).json({success:false,message:'There is no user with email address',status:'fail'});
            }

            const hashedToken = user.createPasswordResetToken();
            await user.save({validateBeforeSave:false});

            const resetURL = `http://${req.headers.host}/auth/resetPassword?id=${hashedToken}`;
           const message =  render(<HappyHourHubResetPasswordEmail userFirstname={user.fullName} resetPasswordLink={resetURL}/>)
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Your password reset token (valid for 10 min)',
                    message
                });

                res.status(200).json({
                    status: 'success',
                    message: 'Token sent to email!'
                });
            } catch (err) {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save({ validateBeforeSave: false });
                // User.findByIdAndUpdate fonksiyonu kullanmamız halinde model shcema kısmında .pre kısımları çalışmaz. getResetToken,getResetDate çalışamaz.
                return  res.status(500).json({success:false,message:'There was an error sending the email. Try again later!',status:'fail'});
            }

        }catch (err){
            console.log(err);
        }
    }
}
export default handler;

