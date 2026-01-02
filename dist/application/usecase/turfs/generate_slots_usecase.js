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
exports.GenerateSlotUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const date_fns_1 = require("date-fns");
const constants_1 = require("../../../shared/constants");
const custom_error_1 = require("../../../domain/utils/custom.error");
let GenerateSlotUseCase = class GenerateSlotUseCase {
    constructor(_slotService) {
        this._slotService = _slotService;
    }
    execute(turfId, ownerId, date, selectedDate, endDate, startTime, endTime, slotDuration, price) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!turfId || !ownerId) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            if (!startTime || !endTime) {
                throw new Error("Start time and end time are required.");
            }
            if (slotDuration <= 0) {
                throw new Error("Slot duration must be greater than 0.");
            }
            if (price < 0) {
                throw new Error("Price cannot be negative.");
            }
            if (!date && (!selectedDate || !endDate)) {
                throw new Error("Date or date range is required.");
            }
            const startHour = parseInt(String(startTime.split(":")[0]));
            const endHour = parseInt(String(endTime.split(":")[0]));
            const generatedSlots = [];
            const generateSlotsForDate = (targetDate) => {
                for (let hour = startHour; hour < endHour; hour++) {
                    const slotStart = `${hour.toString().padStart(2, "0")}:00`;
                    const slotEnd = `${(hour + slotDuration)
                        .toString()
                        .padStart(2, "0")}:00`;
                    generatedSlots.push({
                        turfId,
                        ownerId,
                        date: targetDate,
                        duration: slotDuration,
                        price,
                        startTime: slotStart,
                        endTime: slotEnd,
                        isBooked: false,
                    });
                }
            };
            const start = new Date(selectedDate);
            const end = new Date(endDate);
            if (selectedDate && endDate && selectedDate !== endDate) {
                const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                for (let i = 0; i <= daysDiff; i++) {
                    const currentDate = (0, date_fns_1.format)((0, date_fns_1.addDays)(start, i), "yyyy-MM-dd");
                    generateSlotsForDate(currentDate);
                }
            }
            else {
                generateSlotsForDate(date);
            }
            try {
                const createdSlots = yield this._slotService.createSlots(generatedSlots);
                return createdSlots;
            }
            catch (err) {
                if (err instanceof Error && "code" in err) {
                    const errorWithCode = err;
                    if (errorWithCode.code === 11000) {
                        throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.SLOT_ALREADY_EXISTS ||
                            "Some slots already exist for this turf/date/time.", constants_1.HTTP_STATUS.CONFLICT);
                    }
                }
                throw err;
            }
        });
    }
};
exports.GenerateSlotUseCase = GenerateSlotUseCase;
exports.GenerateSlotUseCase = GenerateSlotUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ISlotService")),
    __metadata("design:paramtypes", [Object])
], GenerateSlotUseCase);
