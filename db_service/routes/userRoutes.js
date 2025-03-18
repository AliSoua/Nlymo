const express = require('express');
const userController = require('../controllers/userController.js');
const authenticateJWT = require('../middlewares/authenticateJWT.js');
const { updateDriverPayments } = require('../controllers/payments/updateDriverPayments.js');
const { makeDriverPayments } = require('../controllers/payments/makeDriverPayments.js');
const router = express.Router();

router.get('/user/info/', authenticateJWT, userController.getUserInfo);
router.all('/user/info/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

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

router.post('/db/course/live/', authenticateJWT, userController.storeCourse);
router.all('/db/course/live/', authenticateJWT, userController.storeCourse);

router.put('/db/course/finished/', authenticateJWT, userController.finishCourse);

router.put('/db/course/canceled/', authenticateJWT, userController.cancelCourse);
router.all('/db/course/canceled/', authenticateJWT, userController.cancelCourse);

router.post('/driver/payments/entry/', authenticateJWT, makeDriverPayments);
router.put('/driver/payments/entry/', authenticateJWT, updateDriverPayments);
router.all('/driver/payments/entry/', authenticateJWT, updateDriverPayments);

module.exports = router;
