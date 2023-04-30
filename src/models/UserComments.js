import mongoose from "mongoose";
import User from "./User";

const UserCommentSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        on_delete: 'cascade'
    },
    comment: {type: String, required: true, maxlength: 400},
}, {
    timestamps: true
});
export default mongoose.models.UserComments || mongoose.model("UserComments", UserCommentSchema);