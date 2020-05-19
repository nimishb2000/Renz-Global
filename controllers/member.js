const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const Token = require('../models/token');
const Announcement = require('../models/announcement');
const Testimonial = require('../models/testimonial');
const Payment = require('../models/payment');

exports.getAnnouncement = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const error = new Error('Token not provided');
        error.statusCode = 401;
        return next(error);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
            const error = new Error(err.message);
            error.statusCode = 403;
            return next(error);
        }
        Token.findOne({ 'token': token })
            .then(token => {
                if (!token) {
                    const error = new Error('Invalid Token');
                    error.statusCode = 403;
                    return next(error);
                }
            })
            .catch(err => {
                return next(err);
            });
        Announcement.find({ 'member_id': decoded })
            .then(announcements => {
                res.status(200).json({
                    announcements
                });
            })
            .catch(err => {
                return next(err);
            });
    });
};

exports.getGPReport = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const error = new Error('Token not provided');
        error.statusCode = 401;
        return next(error);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
            const error = new Error(err.message);
            error.statusCode = 403;
            return next(error);
        }
        Token.findOne({ 'token': token })
            .then(token => {
                if (!token) {
                    const error = new Error('Invalid Token');
                    error.statusCode = 403;
                    return next(error);
                }
            })
            .catch(err => {
                return next(err);
            });
        Payment.find({ sender: decoded })
            .then(payments => {
                res.status(200).json({
                    payments
                });
            })
            .catch(err => { return next(err) });
    });
};

exports.getWallet = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const error = new Error('Token not provided');
        error.statusCode = 401;
        return next(error);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
            const error = new Error(err.message);
            error.statusCode = 403;
            return next(error);
        }
        Token.findOne({ 'token': token })
            .then(token => {
                if (!token) {
                    const error = new Error('Invalid Token');
                    error.statusCode = 403;
                    return next(error);
                }
            })
            .catch(err => {
                return next(err);
            });
        Payment.find({ recipient: decoded })
            .then(payments => {
                res.status(200).json({
                    payments
                });
            })
            .catch(err => { return next(err) });
    });
};

exports.postTestimonial = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        const error = new Error('Token not provided');
        error.statusCode = 401;
        return next(error);
    }
    token = token.slice(7, token.length);
    jwt.verify(token, config.tokenSecret, async (err, decoded) => {
        if (err) {
            const error = new Error(err.message);
            error.statusCode = 403;
            return next(error);
        }
        Token.findOne({ 'token': token })
            .then(token => {
                if (!token) {
                    const error = new Error('Invalid Token');
                    error.statusCode = 403;
                    return next(error);
                }
            })
            .catch(err => {
                return next(err);
            });
        const member = await Member.findOne({ 'self_id': decoded }).exec().catch(err => { return next(err); });
        if (!member) {
            const error = new Error('Incorrect username');
            error.statusCode = 406;
            return next(error);
        }
        const image = req.file;
        if (!image) {
            const error = new Error('Image not uploaded');
            error.statusCode = 422;
            return next(error);
        }
        const recipient = member.sponser_id;
        const name = req.body.name;
        const subject = req.body.subject;
        const message = req.body.message;
        const filepath = image.path;
        const testimonial = new Testimonial({
            recipient,
            name,
            subject,
            message,
            filepath
        });
        testimonial.save();
    });
};