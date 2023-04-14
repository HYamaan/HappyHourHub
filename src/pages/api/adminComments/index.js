import dbConnect from "../../../utilities/dbConnect";
import AdminControlComments from "../../../models/AdminControlComments";
import UserComments from "../../../models/UserComments"
import User from "../../../models/User";
const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;

    if (method === "GET") {
        try {
            const adminMainPageControlComments = await AdminControlComments.find()
                .populate({
                    path: "userCommentsTable",
                    model: "UserComments"
                }).populate({
                    path:"userId",
                    model:"User"
                });
            res.status(200).json(adminMainPageControlComments);
        } catch (err) {
            console.log(err);
        }
    }
    if (method === "POST") {
        try {
            const newAdminMainPageControlComments = await AdminControlComments.create(req.body);
            res.status(201).json(newAdminMainPageControlComments);
        } catch (err) {
            console.log(err);
        }
    }
}
export default handler;

