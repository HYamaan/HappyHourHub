import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        title:{
            type:String,
            required: true,
            maxlength:60,
        }
    },
    { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);