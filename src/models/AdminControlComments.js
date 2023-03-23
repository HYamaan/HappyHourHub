import mongoose from "mongoose";

const AdminControlCommentSchema = new mongoose.Schema({
    userId: {type: String}, image: {type: String}, comment: {type: String},
}, {
    timestamps: true
});
export default mongoose.models.AdminControlComments || mongoose.model("AdminControlComments", AdminControlCommentSchema);