import cron from "node-cron";
import { BookinModel } from "../../interfaceAdapters/database/mongoDb/models/booking_model";
import { toDateTime } from "../../shared/utils/time";
import { HostedGameModel } from "../../interfaceAdapters/database/mongoDb/schemas/hosted_game_schema";

export const startBookingCompletionCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      /* =======================
         ✅ COMPLETE BOOKINGS
      ======================= */
      const bookings = await BookinModel.find({
        status: "confirmed",
      });

      for (const booking of bookings) {
        const bookingEnd = toDateTime(booking.date, booking.endTime);

        if (bookingEnd <= now) {
          await BookinModel.updateOne(
            { _id: booking._id },
            { status: "completed" }
          );
        }
      }

      const hostedGames = await HostedGameModel.find({
        status: { $in: ["open", "full"] },
      });

      for (const game of hostedGames) {
        const gameEnd = toDateTime(game.slotDate, game.endTime);

        if (gameEnd <= now) {
          await HostedGameModel.updateOne(
            { _id: game._id },
            { status: "completed" }
          );
        }
      }

    } catch (err) {
      console.error("❌ Cron error:", err);
    }
  });
};
