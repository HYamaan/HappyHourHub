import mongoose from "mongoose";

const UserCommentSchema = new mongoose.Schema({
    userId: {type: String}, image: {type: String}, comment: {type: String, required: true, maxlength: 400},
}, {
    timestamps: true
});
export default mongoose.models.UserComments || mongoose.model("UserComments", UserCommentSchema);