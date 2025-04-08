const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } 
});

module.exports = mongoose.model('TimeSlot', TimeSlotSchema);

