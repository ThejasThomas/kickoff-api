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
exports.GetSlotsUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let GetSlotsUseCase = class GetSlotsUseCase {
    constructor(_ruleRepository, _bookingRepository, _hostedGamesRepository) {
        this._ruleRepository = _ruleRepository;
        this._bookingRepository = _bookingRepository;
        this._hostedGamesRepository = _hostedGamesRepository;
    }
    execute(turfId, date, dayIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rules = yield this._ruleRepository.findOne({ turfId });
                if (!rules)
                    return [];
                const weeklyRulesMap = rules.weeklyRules[0] || {};
                const timeRanges = weeklyRulesMap[dayIndex] || [];
                const requestDate = date;
                const bookings = yield this._bookingRepository.findByTurfIdAndDate(turfId, requestDate);
                const hostedGames = yield this._hostedGamesRepository.findbyTurfIdAndDate(turfId, requestDate);
                const slots = [];
                for (const range of timeRanges) {
                    const rangeStart = this.parseTime(requestDate, range.startTime);
                    const rangeEnd = this.parseTime(requestDate, range.endTime);
                    const durationMs = rules.slotDuration * 60 * 60 * 1000;
                    let current = rangeStart;
                    while (current < rangeEnd) {
                        const slotEnd = new Date(current.getTime() + durationMs);
                        if (slotEnd > rangeEnd)
                            break;
                        const slotStart = current;
                        const isBookedByBooking = bookings.some((bk) => {
                            const bookingStart = this.parseTime(requestDate, bk.startTime);
                            const bookingEnd = this.parseTime(requestDate, bk.endTime);
                            return bookingStart < slotEnd && bookingEnd > slotStart;
                        });
                        const isBookedByHostedGames = hostedGames.some((game) => {
                            const gameStart = this.parseTime(requestDate, game.startTime);
                            const gameEnd = this.parseTime(requestDate, game.endTime);
                            return gameStart < slotEnd && gameEnd > slotStart;
                        });
                        const isBooked = isBookedByBooking || isBookedByHostedGames;
                        slots.push({
                            id: `${turfId}-${date}-${slotStart.toISOString()}`,
                            turfId,
                            date,
                            ownerId: "",
                            startTime: this.formatTime(slotStart),
                            endTime: this.formatTime(slotEnd),
                            price: rules.price,
                            duration: rules.slotDuration,
                            isBooked,
                        });
                        current = slotEnd;
                    }
                }
                const today = new Date().toISOString().split("T")[0];
                if (requestDate === today) {
                    const now = new Date();
                    now.setMinutes(0, 0, 0);
                    now.setHours(now.getHours() + 1);
                    return slots.filter((slot) => {
                        const slotStart = this.parseTime(requestDate, slot.startTime);
                        return slotStart >= now && !slot.isBooked;
                    });
                }
                return slots.filter((slot) => !slot.isBooked);
            }
            catch (err) {
                console.log("Slot generation error", err);
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.SLOT_NOT_FOUND, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
        });
    }
    parseTime(dateStr, timeStr) {
        let hours = 0, minutes = 0;
        if (/am|pm/i.test(timeStr)) {
            const lower = timeStr.toLowerCase();
            const [timePart, modifier] = lower.split(/(am|pm)/);
            const [h, m] = timePart.split(":").map(Number);
            hours = h;
            minutes = m;
            if (modifier === "pm" && h !== 12)
                hours += 12;
            if (modifier === "am" && h === 12)
                hours = 0;
        }
        else {
            [hours, minutes] = timeStr.split(":").map(Number);
        }
        const d = new Date(`${dateStr}T00:00:00`);
        d.setHours(hours, minutes, 0, 0);
        return d;
    }
    formatTime(date) {
        return `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes().toString()
            .padStart(2, "0")}`;
    }
};
exports.GetSlotsUseCase = GetSlotsUseCase;
exports.GetSlotsUseCase = GetSlotsUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IRuleRepository")),
    __param(1, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(2, (0, tsyringe_1.inject)("IHostedGameRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetSlotsUseCase);
