import dbConnect from "../../../utilities/dbConnect";
import PaymentSuccess from "../../../models/payment-success";


const handler = async (req, res) => {
    await dbConnect();
    const {method, query:{id}} = req;

    if (method === "GET") {
        try {
            const category = await PaymentSuccess.findById(id);
            res.status(200).json(category);
        } catch (err) {
            console.log(err);
        }
    }




};

export default handler;