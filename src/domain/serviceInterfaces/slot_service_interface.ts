import { ISlot } from "../../application/turfs/generate_slots_usecase";
import { ISlotEntity } from "../models/slot_entity";
import { IBaseRepository } from "../repositoryInterface/base-repository.interface";

export interface ISlotService {
    createSlots(slots:ISlot[]):Promise<ISlotEntity[]>
      findByTurfIdAndDate(turfId: string, date: string): Promise<ISlotEntity[]>

}
