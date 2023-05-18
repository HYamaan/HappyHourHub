import { nanoid } from 'nanoid'
import mongoose  from "mongoose";

const PaymentFailedSchema = new mongoose.Schema({
    uid:{
        type:String,
        default:nanoid(),
        unique:true,
        required:true
    },
    status:{
        type:String,
        required: true,
        enum:["failure"],
    },
    conversationId:{
        type:String,
        required:true
    },
    errorCode:{
        type:String,
        required:true
    },
    errorMessage:{
        type:String,
        required:true
    },
    log:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    }
})
export default mongoose.models.PaymentFailed || mongoose.model("PaymentFailed",PaymentFailedSchema)