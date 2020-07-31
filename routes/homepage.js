var express = require('express');
var router = express.Router();

// Require controller modules.
var card_controller = require('../controllers/cardController');

// GET catalog home page.
router.get('/', card_controller.index);
router.post('/', card_controller.post);
module.exports = router;