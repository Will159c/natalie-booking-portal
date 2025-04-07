const TimeSlot = require('../models/TimeSlot');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

const createSlot = async (req, res) => {
    try {
        const { date, time, location } = req.body;
        const newSlot = new TimeSlot({ date, time, location });
        await newSlot.save();
        res.status(201).json({ message: 'Slot created successfully', slot: newSlot });
    } catch (error) {
        res.status(500).json({ message: 'Error creating slot', error: error.message });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const slots = await TimeSlot.find({ isBooked: false });
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slots', error: error.message });
    }
};

const removeSlot = async (req, res) => {
    try {
        const { slotId } = req.body;
        await TimeSlot.findByIdAndDelete(slotId);
        res.status(200).json({ message: 'Slot removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing slot', error: error.message });
    }
};

const unbookSlot = async (req, res) => {
    try {
        const { slotId } = req.body;
        await TimeSlot.findByIdAndUpdate(slotId, { isBooked: false, user: null });
        res.status(200).json({ message: 'Slot unbooked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unbooking slot', error: error.message });
    }
};

const getBookedSlots = async (req, res) => {
    try {
        const slots = await TimeSlot.find({ isBooked: true });
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booked slots', error: error.message });
    }
};

const bookSlot = async (req, res) => {
    try {
        const { slotId, userId } = req.body;
        const slot = await TimeSlot.findById(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });
        if (slot.isBooked) return res.status(400).json({ message: 'Slot already booked' });
        slot.isBooked = true;
        slot.user = userId;
        await slot.save();
        res.status(200).json({ message: 'Slot booked successfully', slot });
    } catch (error) {
        res.status(500).json({ message: 'Error booking slot', error: error.message });
    }
};

module.exports = { createSlot, getAvailableSlots, bookSlot, getBookedSlots, removeSlot, unbookSlot };
