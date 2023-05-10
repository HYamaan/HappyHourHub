import mongoose from "mongoose";

import User from "./User";
import Product from "./Product";

const userFavoriteListSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        on_delete: 'cascade',
        select:false
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:Product,
            on_delete: 'cascade'
        }
    ]


}, {
    timestamps: true
});
export default mongoose.models.userFavoriteList || mongoose.model("userFavoriteList", userFavoriteListSchema);