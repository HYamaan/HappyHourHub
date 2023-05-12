import User from "./../../../models/User";
import Product from "./../../../models/Product";
import UserFavoritesList from "../../../models/userFavoritesList";
import ShoppingCartUser from "../../../models/shoppingCartUser";


const handler = async (req, res) => {
    const {method} = req;
    const userId = req.query?.slug[1]?.split('=')[1]
    const productId = req.query?.slug[2]?.split('=')[1]
    if (req.query.slug[0] === "user-favorite-list") {
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
                if (userId) {
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
                if (favoriteList.products.includes(productId)) {
                    return res.status(200).json({success: false, message: 'Ürün zaten var'});
                }
                favoriteList.products.push(productId)
                await favoriteList.save();

                return res.status(201).json({message: "Product added to favorite list successfully"});
            } catch (error) {
                console.log(error);
                return res.status(500).json({message: "Internal Server Error"});
            }
        }
        if (method === 'DELETE') {
            try {
                if (!userId && !productId) {
                    res.status(400).json({success: false, message: 'Ürün bulunamadı.'})
                }
                const userFavoriteList = await UserFavoritesList.findOne({userId});
                if (!userFavoriteList) {
                    return res.status(404).json({message: "Favori ürün Bulunamadı"});
                }

                const updatedList = userFavoriteList.products.filter((item) => {
                    return item.toString() !== productId
                });
                userFavoriteList.products = updatedList;
                await userFavoriteList.save();
                return res.status(200).json({success: true, message: 'Ürün favoriler sayfasından kaldırıldı.'})
            } catch (err) {
                console.log(err);
                return res.status(500).json({message: "Internal Server Error"});
            }


        }
    }
    if (req.query.slug[0] === "user-shopping-cart") {

        if (method === "GET") {
            try {
                if (!userId) {
                    const userShoppingCart = await ShoppingCartUser.find()
                        .populate({
                            path: "products.product",
                            model: "Product"
                        }).populate({
                            path: "userId",
                            model: "User"
                        });
                    res.status(200).json(userShoppingCart);
                }
                if (userId) {
                    const userShoppingCart = await ShoppingCartUser.findOne({userId})
                        .populate({
                            path: "products.product",
                            model: "Product"
                        })
                        .populate({
                            path: "userId",
                            model: "User"
                        })
                        .select("products");

                    res.status(200).json(userShoppingCart);
                }
            } catch (err) {
                console.log(err);
            }
        }
        if (method === "POST") {

            try {
                if (!userId) {
                    res.status(400).json({success: false, message: 'Kullancı bulunamadı.'})
                }
                let userShoppingCart = await ShoppingCartUser.findOne({userId});

                if (!userShoppingCart) {
                    userShoppingCart = await ShoppingCartUser({userId});
                }
                req.body.products.map(async (item) => {
                    const isThereAny = userShoppingCart.products.some(prod => prod.sku === item.sku)
                    if (!isThereAny) {
                        userShoppingCart.products.push({
                            product: item._id,
                            sku: item.sku,
                            extras: item.extras,
                            price: item.price,
                            productTotal: item.productTotal,
                            status: item.status
                        })
                    }else {
                        await ShoppingCartUser.findByIdAndUpdate(userShoppingCart._id, {
                            $pull: { 'products': { '_id': item._id } }
                        });
                    }

                });

                await userShoppingCart.save();
                return res.status(201).json({message: "Product added to Redux list successfully"});
            } catch (error) {
                console.log(error);
                return res.status(500).json({message: "Internal Server Error"});
            }
        }
    }
}

export default handler;