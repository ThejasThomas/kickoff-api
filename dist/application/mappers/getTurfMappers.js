"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGetTurfDTO = mapGetTurfDTO;
function mapGetTurfDTO(entity) {
    var _a, _b;
    return {
        _id: (_b = ((_a = entity.id) !== null && _a !== void 0 ? _a : entity._id)) === null || _b === void 0 ? void 0 : _b.toString(),
        turfName: entity.turfName,
        contactNumber: entity.contactNumber,
        images: entity.images,
        pricePerHour: entity.pricePerHour,
        location: {
            address: entity.location.address,
            city: entity.location.city,
            state: entity.location.state,
        },
        courtType: entity.courtType,
        status: entity.status,
        ownerId: entity.ownerId,
    };
}
