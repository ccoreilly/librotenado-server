const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    owners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }]
});

module.exports = mongoose.model("Account", accountSchema);
