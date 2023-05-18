import Product from './Product';

const mongoose = require('mongoose');
const PaymentsSuccessSchema = new mongoose.Schema({
        uid: {
            type: String
        },
        status: {
            type: String,
            required: true,
            enum: ['success'],
        },
        cartId: {
            type: String,
            required: true,
        },
        conversationId: {
            type: String,
            required: true,
        },
        currency: {
            type: String,
            required: true,

        },
        paymentId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        paidPrice: {
            type: Number,
            required: true,
        },
        itemTransaction: [{
            uid: {
                type: String
            },
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: Product,
                required: true,
            },
            paymentTransactionId: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            paidPrice: {
                type: Number,
                required: true,
            },
        }
        ],
        log: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
    },
    {
        timestamps: true,
    }
);


export default mongoose.models.PaymentsSuccess || mongoose.model('PaymentsSuccess', PaymentsSuccessSchema);
