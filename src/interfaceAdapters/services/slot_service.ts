import { duration } from "zod/v4/classic/iso.cjs";
import { ISlotService } from "../../domain/serviceInterfaces/slot_service_interface";
import { ISlot } from "../../application/turfs/generate_slots_usecase";
import { ISlotEntity } from "../../domain/models/slot_entity";
import { SlotModel } from "../database/mongoDb/models/slot_model";


export class SlotService implements ISlotService{
    async createSlots(slots: ISlot[]): Promise<ISlotEntity[]> {
        const createdSlots =await SlotModel.create(slots)
        return createdSlots.map((slot)=>({
            id:slot._id.toString(),
            turfId:slot.turfId,
            ownerId:slot.ownerId,
            date:slot.date,
            startTime:slot.startTime,
            endTime:slot.endTime,
            isBooked:slot.isBooked,
            duration:slot.duration,
            price:slot.price,
        }))
    }
}