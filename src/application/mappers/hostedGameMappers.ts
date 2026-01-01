import { IHostedGameEntity } from "../../domain/models/hosted_game_entity";
import { HostedGameDTO, HostedPlayerDTO } from "../dtos/host_game_dto";

export function mapHostedGameDTO(
  entity: IHostedGameEntity
): HostedGameDTO {
  return {
    _id: entity._id!.toString(),
    hostUserId: entity.hostUserId,
    turfId: entity.turfId,
    courtType: entity.courtType,
    slotDate: entity.slotDate,
    startTime: entity.startTime,
    endTime: entity.endTime,
    gameStartAt: entity.gameStartAt,
    pricePerPlayer: entity.pricePerPlayer,
    capacity: entity.capacity,
    status: entity.status,
    players: entity.players?.map(mapHostedPlayerDTO) || [],
    createdAt: entity.createdAt,
  };
}

export function mapHostedPlayerDTO(
  player: any
): HostedPlayerDTO {
  return {
    userId: player.userId,
    status: player.status,
    paymentId: player.paymentId,
    joinedDate: player.joinedDate,
  };
}

export function mapHostedGameDTOList(
  entities: IHostedGameEntity[]
): HostedGameDTO[] {
  return entities.map(mapHostedGameDTO);
}
