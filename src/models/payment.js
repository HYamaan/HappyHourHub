import mongoose from "mongoose";


const PaymentSchema = new mongoose.Schema({
    sendData:{
        type:Object,
        required:true
    },
    resultData:{
        type:Object,
        required:true
    }

}, {
    timestamps: true
});
export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);