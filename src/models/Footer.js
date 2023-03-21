import mongoose from "mongoose";

const FooterSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required: true,
            maxlength:60,
        },
        location:{
            type:String,
            required: true,
            maxlength:60,
        },
        phoneNumber:{
            type:String,
            required: true,
        },
        desc:{
            type:String,
            required: true,

        },
        socialMedia:{
            type:[
                {
                    icon:{type:String},
                    link:{type:String}
                }
            ],
        },
        openingHours:{
            type:{
                day:{type:String},
                hour:{type:String},
            },
        },
    },
    { timestamps: true }
);

export default mongoose.models.Footer || mongoose.model("Footer", FooterSchema);