const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const config = require('../util/config');
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
    jwt.verify(token, config.tokenKey, (err, decoded) => {
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
        Announcement.find({ 'member_id': decoded.id })
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
    jwt.verify(token, config.tokenKey, (err, decoded) => {
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
    jwt.verify(token, config.tokenKey, (err, decoded) => {
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
    jwt.verify(token, config.tokenKey, async (err, decoded) => {
        if (err) {
            const error = new Error(err.message);
            error.statusCode = 403;
            return next(error);
        }
        fetched_token = await Token.findOne({ 'token': token }).exec().catch(err => { return next(err) });
        if (!fetched_token) {
            const error = new Error('Invalid Token');
            error.statusCode = 403;
            return next(error);
        }
        const member = await Member.findOne({ 'self_id': decoded.id }).exec().catch(err => { return next(err); });
        if (!member) {
            const error = new Error('Invalid Token');
            error.statusCode = 406;
            return next(error);
        }
        const image = req.file;
        if (!image) {
            const error = new Error('Image not uploaded');
            error.statusCode = 422;
            return next(error);
        }
        const recipient = member.sponsor_id;
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
        res.status(200).json({
            message: 'Testimonial Uploaded'
        });
    });
};