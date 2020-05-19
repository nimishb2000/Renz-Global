const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    recipient: { type: String, required: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    filepath: {type: String, required: true}
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);