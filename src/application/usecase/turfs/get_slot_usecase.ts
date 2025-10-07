import { inject, injectable } from "tsyringe";
import { IGetSlotsUseCase } from "../../../domain/useCaseInterfaces/turfOwner/turfs/get_slots_usecase";
import { ISlotEntity } from "../../../domain/models/slot_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IRuleRepository } from "../../../domain/repositoryInterface/Turf/rule_repository_interface";
import { IRules, ITimeRange } from "../../../domain/models/rule_entity";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";

@injectable()
export class GetSlotsUseCase implements IGetSlotsUseCase {
    constructor(
        @inject("IRuleRepository")
        private _ruleRepository: IRuleRepository,
        @inject("IBookingRepository")
        private _bookingRepository: IBookingRepository
    ) {}

    async execute(
        turfId: string,
        date: string,
        dayIndex: number
    ): Promise<ISlotEntity[]> {
        try {
            console.log('broooiiiiii',turfId,date,dayIndex)
            if (dayIndex < 0 || dayIndex > 6) {
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_DAY_INDEX,
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            const rules: IRules | null = await this._ruleRepository.findOne({ turfId });
            
            if (!rules) {
                return this.generateDefaultSlots(turfId, date, dayIndex);
            }

               const isExceptional= await this._ruleRepository.findExpetionalDates(turfId,date);
               console.log('isExceptional',isExceptional)
            if(isExceptional) {
                return this.generateDefaultSlots(turfId, date, dayIndex)
            }


            const weeklyRulesMap = rules.weeklyRules[0] || {};
            const timeRangesForDay: ITimeRange[] = weeklyRulesMap[dayIndex.toString()] || [];
            console.log('timerenge',timeRangesForDay)
            const bookings = await this._bookingRepository.findByTurfIdAndDate(turfId, date);

            const availableSlots: ISlotEntity[] = [];
            for (const range of timeRangesForDay) {
                console.log('range',range)
                const startTime = this.parseTime(range.startTime);
                console.log('startTime',startTime)
                const endTime = this.parseTime(range.endTime);
                console.log('endTime',endTime)

                if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                    continue; 
                }

                const durationMs = rules.slotDuration*60 * 60 * 1000;
                console.log('duration',durationMs)
                let currentTime = startTime;
                while (currentTime < endTime) {
                    const slotEndTime = new Date(currentTime.getTime() + durationMs);
                    console.log('slotEndtime',slotEndTime)
                    if (slotEndTime <= endTime) {
                        const startTimeStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
                        const endTimeStr = `${slotEndTime.getHours().toString().padStart(2, '0')}:${slotEndTime.getMinutes().toString().padStart(2, '0')}`;
                        const slot: ISlotEntity = {
                            id: `${turfId}-${date}-${currentTime.toISOString()}`,
                            ownerId:"",
                            turfId,
                            date,
                            startTime: startTimeStr,
                            endTime: endTimeStr,  
                            price: rules.price,
                            duration: rules.slotDuration,
                            isBooked: false
                        };
                        console.log('slotenddd',this.parseTime(slot.endTime))

                        const isSlotBooked = bookings.some(booking =>
                            booking.date === date &&
                            this.isTimeOverlap(
                                { start: this.parseTime(booking.startTime), end: this.parseTime(booking.endTime) },
                                { start: currentTime, end: slotEndTime }
                            )
                        );
                        console.log('isSlotBooked',isSlotBooked)

                        if (!isSlotBooked) {
                            availableSlots.push(slot);
                        }
                    }
                    currentTime = slotEndTime;
                }
            }

            const now = new Date();
            const currentDateStr = now.toISOString().split('T')[0];
            console.log('currentDate',currentDateStr)
            // const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            if (date === currentDateStr) {
                return availableSlots.filter(slot =>
                    this.parseTime(slot.endTime) > now
                );
            }

            console.log('availableslots',availableSlots)

            return availableSlots;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(
                ERROR_MESSAGES.SLOT_NOT_FOUND,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    private generateDefaultSlots(turfId: string, date: string, dayIndex: number): ISlotEntity[] {
        return [{
            id: `${turfId}-${date}-${dayIndex}`,
            turfId,
            date,
            ownerId:"",
            startTime: "00:00",
            endTime: "00:00",
            price: 0,
            duration: 1,
            isBooked: false
        }];
    }

    private parseTime(timeStr: string): Date {
        if (!timeStr || typeof timeStr !== 'string') {
            return new Date(NaN);
        }
        
        const lower = timeStr.toLowerCase();
        const [time, modifier] = lower.split(/(am|pm)/);
        let [hours, minutes] = time.split(':').map(Number);

        if (isNaN(hours) || isNaN(minutes)) {
            return new Date(NaN);
        }

        if (modifier && modifier.includes('pm') && hours !== 12) hours += 12;
        if (modifier && modifier.includes('am') && hours === 12) hours = 0;

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    private isTimeOverlap(range1: { start: Date; end: Date }, range2: { start: Date; end: Date }): boolean {
        return range1.start < range2.end && range1.end > range2.start;
    }
}