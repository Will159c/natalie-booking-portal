const TimeSlot = require('../models/TimeSlot');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/mailer');

const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, location } = req.body;

    // Parse using JavaScript Date constructor with full string
    const start = new Date(`${date} ${startTime}`);
    const end = new Date(`${date} ${endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    const slotPromises = [];
    let current = new Date(start);

    while (current <= end) {
      const timeString = current.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      slotPromises.push(
        new TimeSlot({
          date,
          time: timeString,
          location,
        }).save()
      );

      current.setMinutes(current.getMinutes() + 15);
    }

    await Promise.all(slotPromises);
    res.status(201).json({ message: "Slots created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating slot", error: error.message });
  }
};





const getAvailableSlots = async (req, res) => {
  try {
    const slots = await TimeSlot.find({ isBooked: false }).sort({ date: 1, time: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slots', error: error.message });
  }
};

const removeSlot = async (req, res) => {
  try {
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: "Missing slotId" });
    }

    await TimeSlot.findByIdAndDelete(slotId);
    res.status(200).json({ message: "Slot removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing slot", error: error.message });
  }
};

const unbookSlot = async (req, res) => {
  try {
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: "Missing slotId" });
    }

    await TimeSlot.findByIdAndUpdate(slotId, {
      isBooked: false,
      bookedBy: null,
    });

    res.status(200).json({ message: 'Slot unbooked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unbooking slot', error: error.message });
  }
};

const getBookedSlots = async (req, res) => {
  try {
    const slots = await TimeSlot.find({ isBooked: true }).populate('bookedBy', 'name email');
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booked slots", error: err.message });
  }
};

const bookSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized - no user ID" });

    const slot = await TimeSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.isBooked || slot.bookedBy) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    // Book the current slot
    slot.bookedBy = userId;
    slot.isBooked = true;
    await slot.save();

    // Remove all other available slots for the same date/location
    await TimeSlot.deleteMany({
      _id: { $ne: slot._id }, // not the one just booked
      date: slot.date,
      location: slot.location,
      isBooked: false,
    });

    // Send confirmation email
    const user = await User.findById(userId);
    if (user) {
      await sendEmail(user.email, {
        subject: "Appointment Confirmation",
        html: `<p>Hello ${user.name},</p>
               <p>Your appointment has been confirmed for <strong>${slot.date}</strong> at <strong>${slot.time}</strong>.</p>
               <p>Location: ${slot.location}</p>
               <p>Thank you!</p>`,
      });
    }

    res.status(200).json({ message: "Slot booked successfully" });

  } catch (err) {
    console.error("Booking failed:", err.message);
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const mySlots = await TimeSlot.find({ bookedBy: userId }).sort({ date: 1 });
    res.status(200).json(mySlots);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your bookings", error: err.message });
  }
};

module.exports = { createSlot, getAvailableSlots, bookSlot, getBookedSlots, removeSlot, unbookSlot, getMyBookings };
