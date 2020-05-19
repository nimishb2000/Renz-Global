const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true }
});

module.exports = mongoose.model('Token', TokenSchema);