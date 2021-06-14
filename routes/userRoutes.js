const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
	.route('/')
	.get(
		authController.authentication,
		authController.restriction,
		userController.getAllUsers
	)
	.post(authController.authentication, userController.createUser);
router
	.route('/:id')
	.get(authController.authentication, userController.getUser)
	.patch(authController.authentication, userController.updateUser)
	.delete(authController.authentication, userController.deleteUser);

module.exports = router;
