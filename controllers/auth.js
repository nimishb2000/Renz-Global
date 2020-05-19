const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const uuid = require('uuid-random');

const config = require('../util/config');
const Member = require('../models/member');
const Token = require('../models/token');
const Announcement = require('../models/announcement');

exports.postCheckId = (req, res, next) => {
    const sponser_id = req.body.sponserID;
    Member.findOne({ 'self_id': sponser_id })
        .then(member => {
            if (!member) {
                const error = new Error('Incorrect sponser ID');
                error.statusCode = 400;
                return next(error);
            }
            res.status(200).json({
                message: 'sponser ID accepted',
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
    const username = req.body.username;
    Member.findOne({ 'username': username })
        .then(member => {
            if (member) {
                const error = new Error('Username already exists');
                error.statusCode = 400;
                return next(error);
            }
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
    const phoneNumber = req.body.phoneNumber;
    Member.findOne({ 'phoneNumber': phoneNumber })
        .then(member => {
            if (member) {
                const error = new Error('Phone number already registered');
                error.statusCode = 400;
                return next(error);
            }
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
    const email = req.body.email;
    Member.findOne({ 'email': email })
        .then(member => {
            if (member) {
                const error = new Error('Email already registered');
                error.statusCode = 400;
                return next(error);
            }
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
    const sponser_id = req.body.sponserID;
    const self_id = uuid();
    const password = req.body.password;
    const tpassword = req.body.tpassword;
    const name = req.body.name;
    const fhname = req.body.fhname;
    const dob = req.body.dob;
    const gender = req.body.gender;
    const hashedPassword = await bcrypt.hashS(password, 10);
    const hashedTPassword = await bcrypt.hash(tpassword, 10);
    const member = new Member({
        username,
        name,
        fhname,
        phoneNumber,
        email,
        dob,
        gender,
        sponser_id,
        self_id,
        password: hashedPassword,
        tpassword: hashedTPassword
    });
    member.save();
    let date = new Date();
    date = `${date.getDate + 1}-${date.getMonth + 1}-${date.getFullYear}`;
    const announcement = new Announcement({
        member_id: self_id,
        message: `Welcome to Renz Global ${name}`,
        title: 'Welcome',
        date
    });
    announcement.save();
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
            const token = jwt.sign(member.self_id, config.tokenKey);
            const new_token = new Token({
                token,
                member: member.id
            });
            return new_token.save();
        })
        .then(() => {
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
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
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
                return fetched_token.remove();
            })
            .then(() => {
                res.status(200).json({
                    message: 'logged out'
                });
            })
            .catch(err => {
                const error = new Error(err);
                return next(error);
            });
    });
};