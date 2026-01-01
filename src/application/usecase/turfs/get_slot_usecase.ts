import { inject, injectable } from "tsyringe";
import { IGetSlotsUseCase } from "../../../domain/useCaseInterfaces/turfOwner/turfs/get_slots_usecase";
import { ISlotEntity } from "../../../domain/models/slot_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IRuleRepository } from "../../../domain/repositoryInterface/Turf/rule_repository_interface";
import { IRules, ITimeRange } from "../../../domain/models/rule_entity";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";

@injectable()
export class GetSlotsUseCase implements IGetSlotsUseCase {
  constructor(
    @inject("IRuleRepository") private _ruleRepository: IRuleRepository,
    @inject("IBookingRepository") private _bookingRepository: IBookingRepository,
    @inject("IHostedGameRepository") private _hostedGamesRepository:IHostedGameRepository
  ) {}

  async execute(
    turfId: string,
    date: string,
    dayIndex: number
  ): Promise<ISlotEntity[]> {
    try {
      const rules = await this._ruleRepository.findOne({ turfId });
      if (!rules) return [];

      const weeklyRulesMap = rules.weeklyRules[0] || {};
      const timeRanges: ITimeRange[] = weeklyRulesMap[dayIndex] || [];

      const requestDate = date; 
      const bookings = await this._bookingRepository.findByTurfIdAndDate(
        turfId,
        requestDate
      );

      const hostedGames=await this._hostedGamesRepository.findbyTurfIdAndDate(
        turfId,
        requestDate
      )

      const slots: ISlotEntity[] = [];

      for (const range of timeRanges) {
        const rangeStart = this.parseTime(requestDate, range.startTime);
        const rangeEnd = this.parseTime(requestDate, range.endTime);

        const durationMs = rules.slotDuration * 60 * 60 * 1000;
        let current = rangeStart;

        while (current < rangeEnd) {
          const slotEnd = new Date(current.getTime() + durationMs);
          if (slotEnd > rangeEnd) break;

          const slotStart = current;

          

          const isBookedByBooking  = bookings.some((bk) => {
            const bookingStart = this.parseTime(requestDate, bk.startTime);
            const bookingEnd = this.parseTime(requestDate, bk.endTime);

            return bookingStart < slotEnd && bookingEnd > slotStart;
          });

          const isBookedByHostedGames =hostedGames.some((game)=>{
            const gameStart=this.parseTime(requestDate,game.startTime);
            const gameEnd=this.parseTime(requestDate,game.endTime)

            return gameStart<slotEnd && gameEnd >slotStart
          })

          const isBooked =isBookedByBooking ||isBookedByHostedGames

          slots.push({
            id: `${turfId}-${date}-${slotStart.toISOString()}`,
            turfId,
            date,
            ownerId: "",
            startTime: this.formatTime(slotStart),
            endTime: this.formatTime(slotEnd),
            price: rules.price,
            duration: rules.slotDuration,
            isBooked,
          });

          current = slotEnd;
        }
      }

   
      const today = new Date().toISOString().split("T")[0];

      if (requestDate === today) {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        now.setHours(now.getHours() + 1); 

        return slots.filter((slot) => {
          const slotStart = this.parseTime(requestDate, slot.startTime);
          return slotStart >= now && !slot.isBooked;
        });
      }

      return slots.filter((slot) => !slot.isBooked);

    } catch (err) {
      console.log("Slot generation error", err);
      throw new CustomError(
        ERROR_MESSAGES.SLOT_NOT_FOUND,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  private parseTime(dateStr: string, timeStr: string): Date {
    let hours = 0, minutes = 0;

    if (/am|pm/i.test(timeStr)) {
      const lower = timeStr.toLowerCase();
      const [timePart, modifier] = lower.split(/(am|pm)/);
      const [h, m] = timePart.split(":").map(Number);

      hours = h;
      minutes = m;

      if (modifier === "pm" && h !== 12) hours += 12;
      if (modifier === "am" && h === 12) hours = 0;
    } else {
      [hours, minutes] = timeStr.split(":").map(Number);
    }

    const d = new Date(`${dateStr}T00:00:00`);
    d.setHours(hours, minutes, 0, 0);
    return d;
  }

  private formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes().toString()
      .padStart(2, "0")}`;
  }
}
