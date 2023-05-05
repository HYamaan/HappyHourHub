const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
    {
        name:{
            type:String
        }
    },
    {timestamps:true}
);
export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
