const router = require('express').Router();

const userController = require('../controllers/user');

router.put('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
