import { IBlockedSlotEntity } from "../../../domain/models/BlockedSlotEntity";
import { IBlockedSlotRepository } from "../../../domain/repositoryInterface/Turf/blocked_slot_repository_interface";
import { BlockedSlotModel } from "../../database/mongoDb/schemas/bolcked_slot_schema";

export class BlockedSlotRepository implements IBlockedSlotRepository {
  async create(data: IBlockedSlotEntity): Promise<IBlockedSlotEntity> {
    const blockedSlot = await BlockedSlotModel.create(data);
    return {
      id: blockedSlot._id?.toString(),
      turfId: blockedSlot.turfId.toString(),
      date: blockedSlot.date,
      startTime: blockedSlot.startTime,
      endTime: blockedSlot.endTime,
      reason: blockedSlot.reason,
      createdAt: blockedSlot.createdAt,
    };
  }
  async findByTurfAndDate(
    turfId: string,
    date: string,
    startTime:string,
    endTime:string
  ): Promise<IBlockedSlotEntity[]> {
    const slots = await BlockedSlotModel.find({ turfId, date,startTime,endTime });

    return slots.map((slot) => ({
      id: slot._id?.toString(),
      turfId: slot.turfId.toString(),
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      reason: slot.reason,
      createdAt: slot.createdAt,
    }));
  }
}
