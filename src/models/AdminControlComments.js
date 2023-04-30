import mongoose from "mongoose";
import UserComments from "./UserComments";
import User from "./User";

const AdminControlCommentSchema = new mongoose.Schema({
    userCommentsTable: {
        type:mongoose.Schema.Types.ObjectId,
        ref:UserComments,
        on_delete: 'cascade'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        on_delete: 'cascade'
    }
}, {
    timestamps: true
});
export default mongoose.models.AdminControlComments || mongoose.model("AdminControlComments", AdminControlCommentSchema);