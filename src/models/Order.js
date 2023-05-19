import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        conversationId:{
            type:String,
            required:true
        },
        basketId:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true,
        },
        surname:{
            type:String,
            required:true,
        },
        email: {
            type: String,
            required: true,
        },

        price:{
            type:Number,
            required:true,
        },
        paidPrice:{
            type:Number,
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
        },
        installment:{
            type:Number,
        },
        address:[
            {
                contactName:{
                    type:String
                },
                country: {
                    type: String,
                },
                city:{
                    type: String,
                },
                address1:{
                    type: String,
                },
            }
        ],

        status:{
            type:Number,
            default:-1,
        },
        completed:{
            type:Boolean,
            default:false,
            required:true
        },

        productOrder:{
            type:[],
        },

        currency:{
            type:String,
            required:true,
            default: "TRY",
            enum:["TRY","USD","EUR"]
        },
        cargo:{
            type:String,
            default:"Yurt içi Kargo",
            enum: ["Yur içi Kargo","Aras Kargo", "GKN Kargo"],
        },
        paymentSuccessId:{
            type:String
        }

    },
    {timestamps:true}
);

export default mongoose.models.Order || mongoose.model("Order",OrderSchema);