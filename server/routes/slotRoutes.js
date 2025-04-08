const express = require('express');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyUser = require('../middleware/verifyUser');
const router = express.Router();
const { createSlot, getAvailableSlots, bookSlot, getBookedSlots, removeSlot, unbookSlot, getMyBookings } = require('../controllers/slotController');

router.get('/availableSlots', getAvailableSlots);
router.post('/bookSlot', bookSlot);
router.post('/unbookSlot', unbookSlot);
router.post('/getBookedSlots', getBookedSlots);
router.post('/getAvailableSlots', getAvailableSlots);
router.post('/createSlot', verifyAdmin, createSlot);
router.post('/removeSlot', verifyAdmin, removeSlot);
router.post("/getBookedSlots", verifyAdmin, getBookedSlots); 
router.post("/myBookings", verifyUser, getMyBookings);



module.exports = router;
