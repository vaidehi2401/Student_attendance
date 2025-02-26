const express = require('express');

const controller = require('../controllers/controllers');

const router = express.Router();
router.get('/students', controller.getStudents);
router.post('/add-student', controller.addStudents);
router.get('/afterAttendance/:date', controller.getAfterAttendance);
router.get('/dashboard', controller.getDashboard);
router.get('/exist/:date', controller.existDate);
router.post('/mark-attendance', controller.markAttendance);

module.exports=router;