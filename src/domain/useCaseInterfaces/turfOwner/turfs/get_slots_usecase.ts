import { IRules } from "../../../models/rule_entity";
import { ISlotEntity } from "../../../models/slot_entity";

export interface IGetSlotsUseCase {
    execute(turfId:string,date:string,dayIndex:number):Promise<ISlotEntity[]>
}