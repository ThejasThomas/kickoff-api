"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapHostedGameDTO = mapHostedGameDTO;
exports.mapHostedPlayerDTO = mapHostedPlayerDTO;
exports.mapHostedGameDTOList = mapHostedGameDTOList;
function mapHostedGameDTO(entity) {
    var _a;
    return {
        _id: entity._id.toString(),
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
        players: ((_a = entity.players) === null || _a === void 0 ? void 0 : _a.map(mapHostedPlayerDTO)) || [],
        createdAt: entity.createdAt,
    };
}
function mapHostedPlayerDTO(player) {
    return {
        userId: player.userId,
        status: player.status,
        paymentId: player.paymentId,
        joinedDate: player.joinedDate,
    };
}
function mapHostedGameDTOList(entities) {
    return entities.map(mapHostedGameDTO);
}
