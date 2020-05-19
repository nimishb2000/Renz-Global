const express = require('express');

const teamController = require('../controllers/team');

const router = express.Router();

router.get('/team/downline', teamController.getDownline);
router.get('/team/direct_sponsers', teamController.getDirectSponsers);

module.exports = router;