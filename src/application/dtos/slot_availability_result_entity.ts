import { IBlockedSlotEntity } from "../../domain/models/BlockedSlotEntity";
import { IBookingEntity } from "../../domain/models/booking_entity";
import { IHostedGameEntity } from "../../domain/models/hosted_game_entity";


export type SlotAvailabilityStatus =
  | "AVAILABLE"
  | "NORMAL_BOOKED"
  | "HOSTED_GAME"
  | "BLOCKED";

export interface ISlotAvailabilityResultEntity {
  status: SlotAvailabilityStatus;
  booking?: IBookingEntity;
  hostedGame?: IHostedGameEntity;
  blockedSlot?: IBlockedSlotEntity;
}
