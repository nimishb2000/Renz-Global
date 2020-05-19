const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    member_id: {type: String, required: true},
    title: {type: String, required: true},
    message: {type: String, required: true},
    date: {type: String, required: true}
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);