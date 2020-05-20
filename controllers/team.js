const jwt = require('jsonwebtoken');

const config = require('../util/config');
const Member = require('../models/member');
const Token = require('../models/token');

exports.getDirectSponsors = (req, res, next) => {
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
        const members = await Member.find({ 'sponsor_id': decoded.id }).exec().catch(err => { return next(err) });
        res.status(200).json({
            members
        });
    });
};

exports.getDownline = (req, res, next) => {
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
        const IDs = [];
        IDs.push(decoded.id);
        let membersArray = [];
        for (i = IDs.length - 1; i >= 0; ) {
            const members = await Member.find({ 'sponsor_id': IDs[i] }).exec().catch(err => { return next(err) });
            membersArray = membersArray.concat(members);
            IDs.pop();
            members.forEach(element => {
                IDs.push(element.self_id);
            });
            i = IDs.length - 1;
        }
        res.status(200).json({
            downline: membersArray
        });
    });
};