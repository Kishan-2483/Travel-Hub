const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

router.use(auth);
router.get('/:roomId', chatController.getMessages);
router.post('/send', chatController.sendMessage);

module.exports = router;
