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
exports.BookingRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base_repository");
const booking_model_1 = require("../../database/mongoDb/models/booking_model");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const cancellationrequest_model_1 = require("../../database/mongoDb/models/cancellationrequest_model");
const getBookingapper_1 = require("../../../application/mappers/getBookingapper");
const mongoose_1 = require("mongoose");
let BookingRepository = class BookingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(booking_model_1.BookinModel);
    }
    findByTurfIdAndDate(turfId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield booking_model_1.BookinModel.find({ turfId, date }).exec();
                return bookings;
            }
            catch (error) {
                console.error("Error fetching boookings by turfId and  date:", error);
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
        });
    }
    findUpComingByUserId(userId, skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const currentDateStr = now.toISOString().split("T")[0];
                const currentTimeStr = `${now
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
                const normalizedSearch = (search || "").trim();
                let filter = {
                    userId,
                    $or: [
                        { date: { $gt: currentDateStr } },
                        { date: currentDateStr, endTime: { $gt: currentTimeStr } },
                    ],
                };
                if (normalizedSearch.length > 0) {
                    filter = {
                        $and: [
                            filter,
                            {
                                $or: [
                                    { turfName: { $regex: normalizedSearch, $options: "i" } },
                                    { location: { $regex: normalizedSearch, $options: "i" } },
                                ],
                            },
                        ],
                    };
                }
                const total = yield booking_model_1.BookinModel.countDocuments(filter);
                const bookings = yield booking_model_1.BookinModel.find(filter)
                    .sort({ date: 1, startTime: 1 })
                    .skip(skip)
                    .limit(limit);
                return { bookings, total };
            }
            catch (error) {
                console.error("Error fetching upcoming bookings by userId:", error);
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
        });
    }
    findPastByUserId(userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const currentDateStr = now.toISOString().split("T")[0];
                const filter = {
                    userId,
                    $or: [
                        { date: { $lt: currentDateStr } },
                        { date: currentDateStr, endTime: { $lt: currentDateStr } },
                    ],
                };
                const [bookings, total] = yield Promise.all([
                    booking_model_1.BookinModel.find(filter)
                        .sort({ date: -1 })
                        .skip(skip)
                        .limit(limit)
                        .exec(),
                    booking_model_1.BookinModel.countDocuments(filter)
                ]);
                return { bookings, total };
            }
            catch (error) {
                console.log(error);
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cancellationrequest_model_1.CancellationRequestModel.findByIdAndUpdate(id, { status }, { new: true });
        });
    }
    getOwnerRequests(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cancellationrequest_model_1.CancellationRequestModel.find({ ownerId });
        });
    }
    updateStatusById(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return booking_model_1.BookinModel.findByIdAndUpdate(bookingId, { status }, { new: true });
        });
    }
    findSlotBooking(turfId, date, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedstartTime = normalizeTime(startTime);
            const normalizedendtime = normalizeTime(endTime);
            console.log("turfId", turfId, "date", date, "starttime", startTime, "endTime", endTime);
            const booking = yield booking_model_1.BookinModel.findOne({
                turfId: turfId,
                date: date,
                startTime: normalizedstartTime,
                endTime: normalizedendtime,
                status: { $ne: "cancelled" },
            });
            if (!booking)
                return null;
            return (0, getBookingapper_1.mapBookingDTO)(booking);
        });
    }
    updateStatusBookings(filter, update) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ _id: new mongoose_1.Types.ObjectId(filter._id) }, { $set: update });
        });
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookingRepository);
const normalizeTime = (time) => {
    const [hourStr, period] = time.split(" ");
    let hour = parseInt(hourStr, 10);
    if (period === "PM" && hour !== 12)
        hour += 12;
    if (period === "AM" && hour === 12)
        hour = 0;
    return hour.toString().padStart(2, "0") + ":00";
};
