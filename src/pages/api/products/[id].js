import dbConnect from "../../../utilities/dbConnect";
import Product from "../../../models/Product"


const handler = async (req, res) => {
    await dbConnect();
    const {method, query:{id}} = req;

    if (method === "GET") {
        try {
            const category = await Product.findById(id);
            res.status(200).json(category);
        } catch (err) {
            console.log(err);
        }
    }
    if (method === "DELETE") {
        try {
            const categoryDelete= await Product.findByIdAndDelete(id);
            res.status(200).json(categoryDelete);

        }catch (err){
            console.log(err);
        }
    }


};

export default handler;