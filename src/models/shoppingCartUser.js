
import mongoose from "mongoose";
import User from "./User";
import Product from "./Product";

const ShoppingCartUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        on_delete: 'cascade',
        select: false
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: Product,
                on_delete: 'cascade'
            },
            sku: {
                type: String
            },
            extras:{
                type:Array,
            },
            price:{
                type:Number
            },
            productTotal:{
                type:Number
            },
            status:{
                type:Number,
            }
        }
    ],
    currency:{
        type:String,
        default: "TRY",
        enum:["TRY","USD","EUR"]
    },
    shoppingCartId:{
        type:String,
    },
    couponId:{
      type:String
    },
    couponPrice:{
        type:String
    },
    cargoPrice:{
        type:String
    }


}, {
    timestamps: true
});

export default mongoose.models.ShoppingCartUser || mongoose.model("ShoppingCartUser", ShoppingCartUserSchema);