import mongoose from "mongoose";
import UserComments from "./UserComments";
import User from "./User";

const AdminControlCommentSchema = new mongoose.Schema({
    userCommentsTable: {
        type:mongoose.Schema.Types.ObjectId,
        ref:UserComments
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }
}, {
    timestamps: true
});
export default mongoose.models.AdminControlComments || mongoose.model("AdminControlComments", AdminControlCommentSchema);