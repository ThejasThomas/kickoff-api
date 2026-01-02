"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBookingDTO = mapBookingDTO;
exports.mapPastBookingDTO = mapPastBookingDTO;
exports.mapBookingDTOList = mapBookingDTOList;
exports.mapPastBookingList = mapPastBookingList;
function mapBookingDTO(entity) {
    return {
        _id: entity._id.toString(),
        userId: entity.userId,
        turfId: entity.turfId,
        startTime: entity.startTime,
        endTime: entity.endTime,
        price: entity.price,
        date: entity.date,
        status: entity.status,
        paymentMethod: entity.paymentMethod,
        paymentStatus: entity.paymentStatus,
        adminCommissionProcessed: entity.adminCommissionProcessed,
        createdAt: entity.createdAt,
    };
}
function mapPastBookingDTO(entity) {
    return {
        _id: entity._id.toString(),
        date: entity.date,
        startTime: entity.startTime,
        endTime: entity.endTime,
        turfId: entity.turfId,
        price: entity.price,
        status: entity.status,
        paymentStatus: entity.paymentStatus,
    };
}
function mapBookingDTOList(entities) {
    return entities.map(mapBookingDTO);
}
function mapPastBookingList(entities) {
    return entities.map(mapPastBookingDTO);
}
