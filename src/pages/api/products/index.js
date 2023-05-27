import dbConnect from "../../../utilities/dbConnect";
import Product from "../../../models/Product"

const handler = async (req, res) => {
    await dbConnect();
    const {method} = req;


    if (method === "GET") {
        try{

            let products;
            if ("limit" in req.query && "mostRepeatedCategory" in req.query){
                products = await Product.find({category:req.query.mostRepeatedCategory}).sort({ price: 1 }).limit(parseInt(req.query.limit)).exec();
            }
            else if ("limit" in req.query) {
                products = await Product.find().sort({ totalSell: 1 }).limit(parseInt(req.query.limit)).exec();
            }else {
                products = await Product.find();
            }

            if (products) {
                return res.status(200).json(products);
            } else {
                return res.status(404).json({ message: "Ürün bulunamadı" });
            }

        }catch (err){

            console.log(err);
        }
    }
    if (method === "POST") {
        try{
            const newProducts = await Product.create(req.body);
            res.status(200).json(newProducts);
        }catch (err){
            console.log(err);
        }
    }
}
export default handler;

