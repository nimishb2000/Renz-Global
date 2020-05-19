const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    sponser_id: {type: String, required: true},
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tPassword: { type: String, required: true },
    name: { type: String, required: true },
    fhname: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    self_id: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Member', MemberSchema);