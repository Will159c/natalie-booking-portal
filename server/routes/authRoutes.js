const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, resendVerification } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get("/verify", verifyEmail);
router.post('/resend', resendVerification);

module.exports = router;
