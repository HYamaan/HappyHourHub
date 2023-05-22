import mongoose from "mongoose";
import Product from "./Product";

const CouponCodeSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discountAmount: {
            type: Number,
            required: function () {
                return !this.productId
            },
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Product,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.CouponCode || mongoose.model("CouponCode", CouponCodeSchema);
