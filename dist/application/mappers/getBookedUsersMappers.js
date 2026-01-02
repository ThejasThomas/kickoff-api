"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBookedUsersDetails = mapBookedUsersDetails;
function mapBookedUsersDetails(entity) {
    return {
        fullName: entity.fullName,
        email: entity.email,
        phoneNumber: entity.phoneNumber
    };
}
