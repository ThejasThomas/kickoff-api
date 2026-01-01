import { ISlotEntity } from "../../models/slot_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface ISlotRepository extends IBaseRepository<ISlotEntity>{
    updateSlotBookedStatus(turfId:string,date:string,startTime:string):Promise<void>
    
}
