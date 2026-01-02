"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.SlotService = void 0;
const slot_model_1 = require("../database/mongoDb/models/slot_model");
const tsyringe_1 = require("tsyringe");
let SlotService = class SlotService {
    constructor(_slotRepository) {
        this._slotRepository = _slotRepository;
    }
    createSlots(slots) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdSlots = yield slot_model_1.SlotModel.create(slots);
            return createdSlots.map((slot) => ({
                id: slot._id.toString(),
                turfId: slot.turfId,
                ownerId: slot.ownerId,
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isBooked: slot.isBooked,
                duration: slot.duration,
                price: slot.price,
            }));
        });
    }
    findByTurfIdAndDate(turfId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slots = yield this._slotRepository.find({
                    turfId,
                    date,
                });
                return slots.map((slot) => ({
                    turfId: slot.turfId,
                    ownerId: slot.ownerId,
                    date: slot.date,
                    duration: slot.duration,
                    price: slot.price,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isBooked: slot.isBooked,
                }));
            }
            catch (error) {
                throw new Error(`Failed to fetch slots from database:${error}`);
            }
        });
    }
};
exports.SlotService = SlotService;
exports.SlotService = SlotService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ISlotRepository')),
    __metadata("design:paramtypes", [Object])
], SlotService);
