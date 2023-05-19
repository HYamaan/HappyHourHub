import crypto from 'crypto';


const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcrypt')


const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Please tell us your name!'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        phoneNumber: {
            type: String,
            maxlength:11
        },
        address:[
            {
                addressType:{
                    type: String,
                },
                customerFullName:{
                    type:String,
                },
                addressEmail: {
                    type: String,

                },
                country: {
                    type: String,
                },
                city:{
                    type: String,
                },
                district:{
                    type:String,
                },
                phoneNumber:{
                    type:String,
                },
                address1:{
                    type: String,
                },
            }
        ],
        zipCode: {
            type: String,
        },
        bio: {
            type: String,
        },
        role:{
            type:String,
            default:"user"
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            minlength:5,
            select:false
        },
        confirmPassword: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                validator: function(el) {
                    return (el == this.password);
                },
                message: 'Passwords are not the same!'
            },
            select:false,
        },
        password1: {
            type: String,
            default: undefined,
            select:false
        },
        password2: {
            type: String,
            default:undefined,
            select:false
        },
        emailVerified: {
            type: String,
            default: false,
        },
        emailVerifiedToken:{
            type:String,
            select: false
        },
        emailVerifiedExpires: {
            type: Date,
            select: false
        },
        image:{
            type:String
        },
        changePasswordAt: {
            type:Date,
            select: false
        },
        passwordResetToken:{
            type:String,
            select: false
        },
        passwordResetExpires:{
            type:Date,
            select: false
        },
        cardUserKey: {
            type: String,

        },
        ip:{
            type:String,
            required:true,
            default:"85.34.78.112"

        }
    },
    { timestamps: true }
);
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = "";

    next();
});

UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword,userPassword);
};

UserSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken= crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10*60*1000;
    return this.passwordResetToken;
};



export default mongoose.models.User || mongoose.model("User", UserSchema);







