const express = require('express');
const { check } = require('express-validator');

const memberController = require('../controllers/member');

const router = express.Router();

router.get('/announcements', memberController.getAnnouncement);
router.get('/gp-report', memberController.getGPReport);
router.get('/wallet', memberController.getWallet);
router.post('/testimonial',
    [
        check('name')
            .matches(/^[a-z ]+$/i)
            .withMessage('Name can contain only alphabets')
            .custom(value => {
                if (value == '') {
                    throw new Error('Please enter your name')
                }
            }),
        check('message')
            .custom(value => {
                if (value == '') {
                    throw new Error('Please provide a message')
                }
            }),
        check('subject')
            .isAlphanumeric()
            .withMessage('Subject can contain only alphabets')
            .custom(value => {
                if (value == '') {
                    throw new Error('Please provide a subject')
                }
            })
    ],
    memberController.postTestimonial
);

module.exports = router;