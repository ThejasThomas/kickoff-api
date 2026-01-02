"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedSlotRepository = void 0;
const bolcked_slot_schema_1 = require("../../database/mongoDb/schemas/bolcked_slot_schema");
class BlockedSlotRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const blockedSlot = yield bolcked_slot_schema_1.BlockedSlotModel.create(data);
            return {
                id: (_a = blockedSlot._id) === null || _a === void 0 ? void 0 : _a.toString(),
                turfId: blockedSlot.turfId.toString(),
                date: blockedSlot.date,
                startTime: blockedSlot.startTime,
                endTime: blockedSlot.endTime,
                reason: blockedSlot.reason,
                createdAt: blockedSlot.createdAt,
            };
        });
    }
    findByTurfAndDate(turfId, date, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const slots = yield bolcked_slot_schema_1.BlockedSlotModel.find({ turfId, date, startTime, endTime });
            return slots.map((slot) => {
                var _a;
                return ({
                    id: (_a = slot._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    turfId: slot.turfId.toString(),
                    date: slot.date,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    reason: slot.reason,
                    createdAt: slot.createdAt,
                });
            });
        });
    }
}
exports.BlockedSlotRepository = BlockedSlotRepository;
