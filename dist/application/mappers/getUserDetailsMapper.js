"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGetUserDetails = mapGetUserDetails;
function mapGetUserDetails(entity) {
    return {
        fullName: entity.fullName,
        email: entity.email,
        phoneNumber: entity.phoneNumber
    };
}
