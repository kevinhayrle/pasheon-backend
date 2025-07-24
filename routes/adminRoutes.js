const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');

// Test route (for debugging)
router.get('/test', (req, res) => {
  res.send('✅ Admin route working');
});

router.post('/login', adminAuthController.login);

module.exports = router;