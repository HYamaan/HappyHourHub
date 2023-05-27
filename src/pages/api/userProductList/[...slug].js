import User from "./../../../models/User";
import Product from "./../../../models/Product";
import UserFavoritesList from "../../../models/userFavoritesList";
import ShoppingCartUser from "../../../models/shoppingCartUser";

import {v4 as uuidv4} from 'uuid';

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
                        .select("+products")
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
                    userShoppingCart = await new ShoppingCartUser({userId});
                }


                if (!userShoppingCart.shoppingCartId) {
                    userShoppingCart.shoppingCartId = uuidv4();
                }


                req.body.products.map(async (item) => {
                    const isThereAny = userShoppingCart.products.some(prod => {

                        return prod.sku === req.body.sku
                    })

                    if (!isThereAny) {

                        userShoppingCart.products.push({
                            product: item._id,
                            sku: item.sku,
                            extras: item.extras,
                            price: item.price,
                            productTotal: item.productTotal,
                            status: item.status
                        })
                    } else {

                        await ShoppingCartUser.findByIdAndUpdate(userShoppingCart._id, {
                            $pull: {'products': {'_id': item._id}}
                        });
                    }

                })

                await userShoppingCart.save();
                return res.status(201).json({message: "Product added to Redux list successfully"});
            } catch (error) {
                console.log(error);
                return res.status(500).json({message: "Internal Server Error"});
            }
        }
        if (method === "PATCH") {

            if (req.query?.updateProductTotal) {

                try {
                    if (!userId) {
                        res.status(400).json({success: false, message: 'Kullancı bulunamadı.'})
                    }
                    let userShoppingCart = await ShoppingCartUser.findOne({userId});
                    const productToUpdate = userShoppingCart.products.find(product => product._id.toString() === req.query.productId);
                    if (!productToUpdate) {
                        return res.status(404).json({success: false, message: 'Ürün bulunamadı.'});
                    }
                    productToUpdate.productTotal = req.query.updateProductTotal;
                    await userShoppingCart.save();
                    return res.status(200).json({success: true});
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({success: false, message: 'İç server hatası.'});
                }
            }
            else if (req.query?.kargoPrice || req.query?.couponPrice) {
                try {
                    if (!userId) {
                        res.status(400).json({success: false, message: 'Kullancı bulunamadı.'})
                    }
                    let userShoppingCart = await ShoppingCartUser.findOne({userId});
                    if(req.query?.kargoPrice && !req.query?.couponPrice){
                        userShoppingCart.cargoPrice = req.query.kargoPrice;
                        userShoppingCart.couponId = undefined;
                        userShoppingCart.couponPrice=undefined;
                    }
                  else if(!req.query?.kargoPrice && req.query?.couponPrice){
                        userShoppingCart.cargoPrice = undefined;
                        userShoppingCart.couponPrice = req.query.couponPrice.toString()
                        userShoppingCart.couponId = req.query.couponId.toString()
                    }else{
                        userShoppingCart.cargoPrice = req.query.kargoPrice;
                        userShoppingCart.couponPrice = req.query.couponPrice.toString()
                        userShoppingCart.couponId = req.query.couponId.toString()
                    }

                        await userShoppingCart.save();
                    return res.status(200).json({success: true});
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({success: false, message: 'İç server hatası.'});
                }
            }
            else if('delete-cargo-couponPrice' in req.query){

                try {
                    if (!userId) {
                        res.status(400).json({success: false, message: 'Kullancı bulunamadı.'})
                    }
                    let userShoppingCart = await ShoppingCartUser.findOne({userId});
                        userShoppingCart.cargoPrice = undefined;
                        userShoppingCart.couponId = undefined;
                        userShoppingCart.couponPrice=undefined;
                    await userShoppingCart.save();
                    return res.status(200).json({success: true});
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({success: false, message: 'İç server hatası.'});
                }
            }
            else if ('add-product' in req.query) {
                try {
                    if (!userId) {
                        res.status(400).json({success: false, message: 'Kullancı bulunamadı.'})
                    }
                    let userShoppingCart = await ShoppingCartUser.findOne({userId});

                    if (!userShoppingCart) {
                        userShoppingCart = await new ShoppingCartUser({userId});
                    }


                    if (!userShoppingCart.shoppingCartId) {
                        userShoppingCart.shoppingCartId = uuidv4();
                    }

                    const item = req.body

                    const isThereAny = userShoppingCart.products.some(prod => {
                        return prod.sku === req.body.sku
                    })

                    if (!isThereAny) {
                        userShoppingCart.products.push({
                            product: item._id,
                            sku: item.sku,
                            extras: item.extras,
                            price: item.price,
                            productTotal: item.productTotal,
                            status: item.status
                        })
                    } else {

                        await ShoppingCartUser.findByIdAndUpdate(userShoppingCart._id, {
                            $pull: {'products': {'_id': item._id}}
                        });
                    }

                    await userShoppingCart.save();
                    return res.status(201).json({message: "Product added to Redux list successfully"});
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({message: "Internal Server Error"});
                }
            }
        }
        if (method === "DELETE") {
            try {
                if (!userId) {
                    return res.status(400).json({success: false, message: 'Kullanıcı bulunamadı.'});
                }

                const sku = req.body.sku;

                const result = await ShoppingCartUser.findOneAndUpdate(
                    {userId},
                    {$pull: {products: {sku}}},
                    {new: true}
                );

                if (!result) {
                    return res.status(400).json({message: "Kullanıcı sepeti bulunamadı"});
                }

                return res.status(200).json({message: "Ürün başarıyla silindi"});
            } catch (error) {
                console.log(error);
                return res.status(500).json({message: "Internal Server Error"});
            }
        }


    }
}

export default handler;