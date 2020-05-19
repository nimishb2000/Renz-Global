const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    sender: {type: String, required: true},
    recipient: {type: String, required: true},
    amount: {type: Number, required: true},
    date: {type: String, required: true}
});

module.exports = mongoose.model('Payment', PaymentSchema);