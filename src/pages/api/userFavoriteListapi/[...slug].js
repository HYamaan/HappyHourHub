import User from "./../../../models/User";
import Product from "./../../../models/Product";
import UserFavoritesList from "../../../models/userFavoritesList";



const handler = async (req, res) => {
    const {method} = req;
    const userId = req.query.slug[0].split('=')[1]
    const productId = req.query.slug[1]?.split('=')[1]
    if (method === "GET") {
        try {
            if (!userId) {
                const adminMainPageControlComments = await UserFavoritesList.find()
                    .populate({
                        path: "products",
                        model: "Product"
                    }).populate({
                        path: "userId",
                        model: "User"
                    });
                res.status(200).json(adminMainPageControlComments);
            }
            if(userId) {
                const adminMainPageControlComments = await UserFavoritesList.findOne({userId})
                    .populate({
                        path: "products",
                        model: "Product"
                    }).populate({
                        path: "userId",
                        model: "User"
                    });
                res.status(200).json(adminMainPageControlComments);
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (method === "POST") {
        try {

            if (!userId && !productId) {
                res.status(400).json({success: false, message: 'Ürün bulunamadı.'})
            }
            let favoriteList = await UserFavoritesList.findOne({userId});

            if (!favoriteList) {
                favoriteList = await UserFavoritesList({userId});
            }
            if(favoriteList.products.includes(productId)){
                return res.status(200).json({success:false,message:'Ürün zaten var'});
            }
            favoriteList.products.push(productId)
            await favoriteList.save();

            return res.status(201).json({message: "Product added to favorite list successfully"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    if(method=== 'DELETE'){
        try {
            if (!userId && !productId) {
                res.status(400).json({success: false, message: 'Ürün bulunamadı.'})
            }
            const userFavoriteList = await UserFavoritesList.findOne({userId});
            if (!userFavoriteList) {
                return res.status(404).json({ message: "Favori ürün Bulunamadı" });
            }

            const updatedList = userFavoriteList.products.filter((item) => {
               return  item.toString() !== productId
            });
            userFavoriteList.products=updatedList;
            await userFavoriteList.save();
            return res.status(200).json({success:true,message:'Ürün favoriler sayfasından kaldırıldı.'})
        }catch (err){
            console.log(err);
            return  res.status(500).json({ message: "Internal Server Error" });
        }



    }

}
export default handler;