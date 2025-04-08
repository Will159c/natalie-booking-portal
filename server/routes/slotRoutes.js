const express = require('express');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();
const { createSlot, getAvailableSlots, bookSlot, getBookedSlots, removeSlot, unbookSlot } = require('../controllers/slotController');

router.get('/availableSlots', getAvailableSlots);
router.post('/bookSlot', bookSlot);
router.get('/bookedSlots', getBookedSlots);
router.post('/unbookSlot', unbookSlot);
router.post('/getBookedSlots', getBookedSlots);
router.post('/getAvailableSlots', getAvailableSlots);
router.post('/createSlot', verifyAdmin, createSlot);
router.post('/removeSlot', verifyAdmin, removeSlot);

module.exports = router;
