"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHostedGameSchema = void 0;
const zod_1 = require("zod");
exports.createHostedGameSchema = zod_1.z.object({
    turfId: zod_1.z.string().min(1, "Turf ID is required"),
    courtType: zod_1.z.string().min(1, "Court type is required"),
    slotDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    startTime: zod_1.z.string().min(1),
    endTime: zod_1.z.string().min(1),
    pricePerPlayer: zod_1.z.number().positive(),
    capacity: zod_1.z.number().int().positive(),
});
