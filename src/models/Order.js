import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        customer:{
            type:String,
            required:true,
            maxlength:100,
        },
        total:{
            type:Number,
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
        },
        address:{
            type:String,
            required:true,
            maxlength:200,
        },
        status:{
            type:Number,
            default:0,
        },
        method:{
            type:Number,
        },

    },
    {timestamps:true}
);

export default mongoose.models.Order || mongoose.model("Order",OrderSchema);