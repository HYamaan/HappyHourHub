import dbConnect from "../../../utilities/dbConnect";
import User from "../../../models/User"

const handler = async (req, res) => {
    await dbConnect();
    const {method, query: {id}} = req;

    if (method === 'PATCH') {

        if (!req.body.password || !req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a new password and password confirmation.'
            });
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({success: false, message: 'Passwords do not match.'});
        }

        const user = await User.findOne({
            passwordResetToken: id,
            passwordResetExpires: {$gt: Date.now()}
        })
            .select('+password')
            .select('+passwordConfirm')
            .select('+passwordResetToken')
            .select('+passwordResetExpires')
            .select('+password2')
            .select('+password1')


        if (!user) {
            //throw new Error('There is no user with the specified password reset token.');
            return res.status(400).json({
                success: false,
                message: 'There is no user with the specified password reset token.'
            });
        }
        const userPasswordArray = [user.password, user.password1, user.password2]
        let isMatch = false;
        for (const userPassword of userPasswordArray) {
            if (userPassword !== undefined) {
                if (await user.correctPassword(req.body.password, userPassword)) {
                    isMatch = true;
                    break;
                }
            }
        }

        if (isMatch) {

            return res.status(400).json({success: false, message: 'same password as before'});
        }
        user.password2 = user.password1;
        user.password1 = user.password;
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        try {
            await user.save();
            return res
                .status(200)
                .json({success: true, message: 'Password updated successfully'});
        } catch (error) {
            console.log(error);
            return res.status(500).json({success: false, error: error.message});
        }
    }
};

export default handler;
