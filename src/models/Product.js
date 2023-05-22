import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    image: {
        type: String, required: true,
    }, title: {
        type: String, required: true, maxlength: 90,
    }, desc: {
        type: String, required: true, maxlength: 1000,
    },
    descForMenu: {
        type: String, required: true, maxlength: 100,
    },
    category: {
        type: String, required: true,
    }, prices: {
        type: [Number], required: true,
    },
    extraOptions: {
        type: [{
            text: {type: String},
            price: {type: Number}
        }],
        required: true,
    },
    currency:{
        type:String,
        default:"TRY",
        enum:["TRY","USD","EUR"]
    },
    stock:{
        type:Number,
        default: 1,
        require:true
    },
    itemType:{
        type:String,
        required:true,
        default:"PHYSICAL",
        enum : ["PHYSICAL","VIRTUAL"]
    },
    kdv:{
        type:String,
        default:0.18,
    },
    totalSell:{
        type:Number,
        default:0
    }

}, {timestamps: true});
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
