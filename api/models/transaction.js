const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: {
        type: Date,
        default: Date.now
    },
    expense: {
        type: Boolean,
        default: true
    },
    concept: String,
    value: {
        type: Number,
        default: 0
    },
    main_account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    secondary_account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model("Transaction", transactionSchema);
