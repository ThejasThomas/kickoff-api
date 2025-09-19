import { ISlotEntity } from "../../models/slot_entity";

export interface IGetSlotsUseCase {
    execute(turfId:string,date:string):Promise<ISlotEntity[]>
}