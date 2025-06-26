const cron = require("node-cron");
const TimeSlot = require("../models/TimeSlot");

function startCleanupJob() {
  // Runs every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    try {
      const now = new Date();

      const allSlots = await TimeSlot.find({});
      const expiredIds = [];

      allSlots.forEach((slot) => {
        const fullDateTime = new Date(`${slot.date} ${slot.time}`);
        if (fullDateTime < now) {
          expiredIds.push(slot._id);
        }
      });

      if (expiredIds.length > 0) {
        const result = await TimeSlot.deleteMany({ _id: { $in: expiredIds } });
        console.log(`🧹 Cleanup complete: ${result.deletedCount} expired slots removed.`);
      }
    } catch (err) {
      console.error("🛑 Error during slot cleanup:", err.message);
    }
  });
}

module.exports = { startCleanupJob };
