import User from "../../../models/User";
import dbConnect from "../../../utilities/dbConnect";

const handler = async (req, res) => {
    await dbConnect();
    const {method, query: { id }} = req;

    if (method === "GET") {
        try {
            const user = await User.findById(id);
            res.status(200).json(user);
        } catch (err) {
            console.log(err);
        }
    }

    if (method === 'PATCH') {

        if (!req.body.password || !req.body.confirmPassword || !req.body.currentPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a current password, new password and password confirmation.'
            });
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({success: false, message: 'Passwords do not match.'});
        }

        const user = await User.findById(id)
            .select('+password')
            .select('+passwordConfirm')

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'There is no user.'
            });
        }

        if( !await user.correctPassword(req.body.currentPassword, user.password)){
            return res.status(400).json({
                success: false,
                message: 'Eski şifre eşleşmiyor .'
            });
        }

        const userPasswordArray = [user.password, user?.password1, user?.password2]
        let isMatch=false;
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