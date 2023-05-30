import mongoose from "mongoose";
import Order from "./Order";

const CancelOrderSchema = new mongoose.Schema({
    order: {
        type:mongoose.Schema.Types.ObjectId,
        ref:Order,
        on_delete: 'cascade'
    },
    description:{
        type:String
    },
    reason:{
        type:String,
    },
    cancelStatus:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
});
export default mongoose.models.CancelOrder || mongoose.model("CancelOrder", CancelOrderSchema);