const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
        fullName:{
            type:String
        },
        userEmail:{
            type:String
        },
        topic:{
            type:String
        },
    },
    {timestamps:true}
);
export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
