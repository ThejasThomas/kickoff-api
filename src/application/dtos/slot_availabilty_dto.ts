import { IBlockedSlotEntity } from "../../domain/models/BlockedSlotEntity";
import { IBookingEntity } from "../../domain/models/booking_entity";
import { IHostedGameEntity } from "../../domain/models/hosted_game_entity";
import { SlotAvailabilityStatus } from "./slot_availability_result_entity";

export interface ISlotAvailabilityResultDTO {
  status: SlotAvailabilityStatus;
  booking?: IBookingEntity;
  hostedGame?: IHostedGameEntity;
  blockedSlot?: IBlockedSlotEntity;
}