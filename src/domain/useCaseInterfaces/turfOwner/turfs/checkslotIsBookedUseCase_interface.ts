import { ISlotAvailabilityResultDTO } from "../../../../application/dtos/slot_availabilty_dto";

export interface ICheckSlotIsBookedUseCase {
    execute(
        turfId:string,date:string,startTime:string,endTime:string
    ):Promise<ISlotAvailabilityResultDTO>
}