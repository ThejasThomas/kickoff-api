import { IBlockedSlotEntity } from "../../models/BlockedSlotEntity";

export interface IBlockedSlotRepository {
  create(data: IBlockedSlotEntity): Promise<IBlockedSlotEntity>;
  findByTurfAndDate(
    turfId: string,
    date: string,
    startTime:string,
    endTime:string
  ): Promise<IBlockedSlotEntity[]>;
}
