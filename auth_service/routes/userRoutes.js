const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authenticateJWT');

// Define routes
router.post('/users/send-sms/', userController.sendSMS);
router.all('/users/send-sms/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

router.post('/users/verify-code/', userController.verifyCode);
router.all('/users/verify-code/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

router.post('/users/register/', userController.register);
router.all('/users/register/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

router.post('/api/token/refresh/', userController.refreshToken);
router.all('/api/token/refresh/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

router.get('/user/info/', authenticateJWT, userController.getUserInfo);
router.all('/user/info/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

router.get('/protected/', authenticateJWT, userController.protected);
router.all('/protected/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

router.put('/user/update/', authenticateJWT, userController.updateUser);
router.all('/user/update/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

// Allow both POST and GET on /user/courses/
router.post('/user/courses/', authenticateJWT, userController.getUserCourses);
router.get('/user/courses/', authenticateJWT, userController.getUserCourses);

// Block all other methods on /user/courses/
router.all('/user/courses/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

router.get('/drivers/', authenticateJWT, userController.allUserInfos);
router.all('/drivers/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

router.post('/admin/block_driver', authenticateJWT, userController.blockDriver);
router.all('/admin/block_driver', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

router.post('/admin/driver_info/', authenticateJWT, userController.getDriverInfo);

module.exports = router;
