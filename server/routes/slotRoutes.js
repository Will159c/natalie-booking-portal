const express = require('express');
const router = express.Router();
const { createSlot, getAvailableSlots, bookSlot, getBookedSlots, removeSlot, unbookSlot } = require('../controllers/slotController');

router.post('/createSlot', createSlot);
router.get('/availableSlots', getAvailableSlots);
router.post('/bookSlot', bookSlot);
router.get('/bookedSlots', getBookedSlots);
router.post('/removeSlot', removeSlot);
router.post('/unbookSlot', unbookSlot);
router.post('/getBookedSlots', getBookedSlots);
router.post('/getAvailableSlots', getAvailableSlots);

module.exports = router;
