import { ISlotAvailabilityResultEntity } from "../../../../application/dtos/slot_availability_result_entity";

export interface ICheckSlotIsBookedUseCase {
    execute(
        turfId:string,date:string,startTime:string,endTime:string
    ):Promise<ISlotAvailabilityResultEntity>
}