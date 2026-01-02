"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOwnerDetails = mapOwnerDetails;
function mapOwnerDetails(entity) {
    return {
        ownerName: entity.ownerName,
        email: entity.email,
        phoneNumber: entity.phoneNumber,
        profileImage: entity.profileImage,
        status: entity.status,
        address: entity.address,
        city: entity.city,
        state: entity.state,
        pinCode: entity.pinCode,
    };
}
