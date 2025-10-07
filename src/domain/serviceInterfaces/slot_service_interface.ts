import { ISlot } from "../../application/usecase/turfs/generate_slots_usecase";
import { ISlotEntity } from "../models/slot_entity";

export interface ISlotService {
    createSlots(slots:ISlot[]):Promise<ISlotEntity[]>
      findByTurfIdAndDate(turfId: string, date: string): Promise<ISlotEntity[]>

}
