const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const uuid = require('uuid-random');

const config = require('../util/config');
const Member = require('../models/member');
const Token = require('../models/token');
const Announcement = require('../models/announcement');

exports.postCheckId = (req, res, next) => {
    const sponsor_id = req.body.sponsorID;
    Member.findOne({ 'self_id': sponsor_id })
        .then(member => {
            if (!member) {
                const error = new Error('Incorrect sponsor ID');
                error.statusCode = 400;
                return next(error);
            }
            res.status(200).json({
                message: 'sponsor ID accepted',
                name: member.name
            });
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
};

exports.postSignup = async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const error = new Error(validationErrors.array()[0].msg);
        error.statusCode = 400;
        return next(error);
    }
    let member;
    const sponsor_id = req.body.sponsor_id;
    member = await Member.findOne({ 'self_id': sponsor_id }).exec().catch(err => {
        const error = new Error(err);
        return next(error);
    });
    if (!member) {
        const error = new Error('Invalid sponsor ID');
        error.statusCode = 400;
        return next(error);
    }
    const username = req.body.username;
    member = await Member.findOne({ 'username': username }).exec().catch(err => {
        const error = new Error(err);
        return next(error);
    });
    if (member) {
        const error = new Error('Username already registered');
        error.statusCode = 400;
        return next(error);
    }
    const phoneNumber = req.body.phoneNumber;
    member = await Member.findOne({ 'phoneNumber': phoneNumber }).exec().catch(err => {
        const error = new Error(err);
        return next(error);
    });
    if (member) {
        const error = new Error('Phone number already registered');
        error.statusCode = 400;
        return next(error);
    }
    const email = req.body.email;
    member = await Member.findOne({ 'email': email }).exec().catch(err => {
        const error = new Error(err);
        return next(error);
    });
    if (member) {
        const error = new Error('Email already registered');
        error.statusCode = 400;
        return next(error);
    }
    const self_id = uuid();
    const password = req.body.password;
    const tPassword = req.body.tPassword;
    const name = req.body.name;
    const fhname = req.body.fhname;
    const dob = req.body.dob;
    const gender = req.body.gender;
    const hashedPassword = await bcrypt.hash(password, 10).catch(err => { return next(err) });
    const hashedTPassword = await bcrypt.hash(tPassword, 10).catch(err => { return next(err) });
    const new_member = new Member({
        username,
        name,
        fhname,
        phoneNumber,
        email,
        dob,
        gender,
        sponsor_id,
        self_id,
        password: hashedPassword,
        tPassword: hashedTPassword
    });
    await new_member.save().catch(err => { return next(err) });
    let date = new Date();
    date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const announcement = new Announcement({
        member_id: self_id,
        message: `Welcome to Renz Global, ${name}`,
        title: 'Welcome',
        date
    });
    await announcement.save().catch(err => { return next(err) });
    res.status(200).json({
        message: 'Sign up successful'
    });
};

exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 400;
        return next(error);
    }
    const username = req.body.username;
    const password = req.body.password;
    const member = await Member.findOne({ 'username': username }).exec().catch(err => {
        const error = new Error(err);
        return next(error);
    });
    if (!member) {
        const error = new Error('Incorrect username');
        error.statusCode = 406;
        return next(error);
    }
    bcrypt.compare(password, member.password)
        .then(doMatch => {
            if (!doMatch) {
                const error = new Error('Incorrect password');
                error.statusCode = 406;
                return next(error);
            }
            const token = jwt.sign({
                id: member.self_id,
                time: new Date().getTime()
            }, config.tokenKey);
            const new_token = new Token({
                token,
                member: member.id
            });
            new_token.save();
            res.status(200).json({
                message: 'signin successful',
                member_id: member.self_id,
                token
            });
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
};

exports.postSignout = (req, res, next) => {
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
            .then(fetched_token => {
                if (!fetched_token) {
                    const error = new Error('Invalid token');
                    error.statusCode = 403;
                    return next(error);
                }
                else {
                    fetched_token.remove();
                    res.status(200).json({
                        message: 'logged out'
                    });
                }
            })
            .catch(err => {
                const error = new Error(err);
                return next(error);
            });
    });
};