const jwt = require('jsonwebtoken');

const config = require('../util/config');
const Member = require('../models/member');
const Token = require('../models/token');

exports.getDirectSponsers = (req, res, next) => {
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
                const error = new Error(err);
                return next(error);
            });
        Member.find({ 'sponser_id': decoded })
            .then(members => {
                res.json(200).json({
                    members
                });
            })
            .catch(err => {
                const error = new Error(err);
                return next(error);
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
                const error = new Error(err);
                return next(error);
            });
        const IDs = [];
        IDs.push(decoded);
        let membersArray = [];
        while (IDs.length != 0) {
            let last_index = IDs.length - 1;
            Member.find({ 'sponser_id': IDs[last_index] })
                .then(members => {
                    membersArray = membersArray.concat(members);
                    IDs.pop();
                    members.forEach(element => {
                        IDs.push(element.self_id);
                    });
                })
                .catch(err => {
                    const error = new Error(err);
                    return next(error);
                });
        }
        res.status(200).json({
            downline: membersArray
        });
    });
};