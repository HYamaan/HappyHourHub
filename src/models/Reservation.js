import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    email: {type: String,required: true},
    fullName:{type:String,required:true},
    persons: {type: String,required:true},
    phoneNumber: {type: Number, required: true},
    date:{type:Date,required:true},
}, {
    timestamps: true
});
export default mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);