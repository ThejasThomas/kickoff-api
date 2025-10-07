import { ISlot } from "../../../../application/usecase/turfs/generate_slots_usecase";

export interface IGenerateSlotUseCase {
    execute(turfId:string,ownerId:string,date:string,selectedDate:string,endDate:string,startTime:string,endTime:string,slotDuration:number,price:number):Promise<ISlot[]>
}