import { ISlotDTO } from "../../../../application/dtos/slot_dto";

export interface IGetSlotsUseCase {
    execute(turfId:string,date:string,dayIndex:number):Promise<ISlotDTO[]>
}