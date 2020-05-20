const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/check-sponsor', authController.postCheckId);
router.post('/signup',
    [
        check('username')
            .isAlphanumeric()
            .withMessage('The username can contain only alphabets and numbers')
            .custom(value => {
                if (value == '') {
                    throw new Error('Please enter a username');
                }
            }),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password must be atleast 8 characters long'),
        check('confirmpassword')
            .custom((value, { req }) => {
                if (value == '') {
                    throw new Error('Confirm your password');
                }
                if (value != req.body.password) {
                    throw new Error('Password does not match');
                }
            }),
        check('tpassword')
            .isLength({ min: 8 })
            .withMessage('Password must be atleast 8 characters long'),
        check('confirmtpassword')
            .custom((value, { req }) => {
                if (value == '') {
                    throw new Error('Confirm your password');
                }
                if (value != req.body.password) {
                    throw new Error('Password does not match');
                }
            }),
        check('name')
            .matches(/^[a-z ]+$/i)
            .withMessage('Name must only contain alphabets')
            .custom(value => {
                if (value == '') {
                    throw new Error('Please enter your name');
                }
            }),
        check('fhname')
            .matches(/^[a-z ]+$/i)
            .withMessage('Name must only contain alphabets')
            .custom(value => {
                if (value == '') {
                    throw new Error('Please enter your father\'s/husband\'s name');
                }
            }),
        check('phonenumber')
            .isLength({ min: 10, max: 10 })
            .withMessage('Enter a correct phone number')
            .isNumeric()
            .withMessage('Phone number can only contain numbers'),
        check('email')
            .isEmail()
            .withMessage('Enter correct email'),
        check('dob')
            .isISO8601()
            .withMessage('Enter DoB in YYYY-MM-DD format'),
        check('gender')
            .isAlpha()
            .withMessage('Gender can only contain alphabets')
            .custom(value => {
                if (value == '') {
                    throw new Error('Specify your gender');
                }
            })
    ],
    authController.postSignup
);
router.post('/login',
    [
        check('username')
            .isAlphanumeric()
            .withMessage('The username can contain only alphabets and numbers')
            .custom(value => {
                if (value == '') {
                    throw new Error('Please enter a username');
                }
            }),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Password must be atleast 8 characters long')
    ],
    authController.postLogin
);
router.post('/signout', authController.postSignout);

module.exports = router;
