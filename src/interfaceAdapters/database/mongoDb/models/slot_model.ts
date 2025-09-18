import { model, ObjectId } from "mongoose";
import { ISlotEntity } from "../../../../domain/models/slot_entity";
import { SlotSchema } from "../schemas/slot_schema";

export interface ISlotModel extends Omit<ISlotEntity,"id">,Document {
    _id:ObjectId;
}

export const SlotModel =model<ISlotModel>("Slot",SlotSchema)