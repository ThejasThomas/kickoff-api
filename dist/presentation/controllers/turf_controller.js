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
exports.TurfController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const error_handler_1 = require("../../shared/utils/error_handler");
const console_1 = require("console");
const custom_error_1 = require("../../domain/utils/custom.error");
let TurfController = class TurfController {
    constructor(_getAllTurfUseCase, _getMyTurfUseCase, _getTurfByIdUseCase, _updateTurfUseCase, _generateSlotsUseCase, _getSlotsUseCase, _bookSlotUseCase, _getNearbyTurfsUseCase, _addRulesUseCase, _getRulesUseCase, _checkSlotIsBookedUseCase, _cancelSlotUseCase, _offlineBookingUseCase, _addMoneyOwnerWalletUsecase, _addReviewUseCase, _getTurfReviewsUsecase, _deleteReviewUseCase, _addRatingUseCase, _getTurfRatingUseCase) {
        this._getAllTurfUseCase = _getAllTurfUseCase;
        this._getMyTurfUseCase = _getMyTurfUseCase;
        this._getTurfByIdUseCase = _getTurfByIdUseCase;
        this._updateTurfUseCase = _updateTurfUseCase;
        this._generateSlotsUseCase = _generateSlotsUseCase;
        this._getSlotsUseCase = _getSlotsUseCase;
        this._bookSlotUseCase = _bookSlotUseCase;
        this._getNearbyTurfsUseCase = _getNearbyTurfsUseCase;
        this._addRulesUseCase = _addRulesUseCase;
        this._getRulesUseCase = _getRulesUseCase;
        this._checkSlotIsBookedUseCase = _checkSlotIsBookedUseCase;
        this._cancelSlotUseCase = _cancelSlotUseCase;
        this._offlineBookingUseCase = _offlineBookingUseCase;
        this._addMoneyOwnerWalletUsecase = _addMoneyOwnerWalletUsecase;
        this._addReviewUseCase = _addReviewUseCase;
        this._getTurfReviewsUsecase = _getTurfReviewsUsecase;
        this._deleteReviewUseCase = _deleteReviewUseCase;
        this._addRatingUseCase = _addRatingUseCase;
        this._getTurfRatingUseCase = _getTurfRatingUseCase;
    }
    getAllTurfs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6, search = "", status } = req.query;
                const pageNumber = Math.max(Number(page), 1);
                const pageSize = Math.max(Number(limit), 1);
                const searchTerm = typeof search === "string" ? search : "";
                console.log("paageeee", pageNumber, "sixeee", pageSize);
                const { turfs, totalPages } = yield this._getAllTurfUseCase.execute(pageNumber, pageSize, searchTerm, status);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    turfs,
                    totalPages,
                    currentPage: pageNumber,
                });
            }
            catch (_a) {
                (0, error_handler_1.handleErrorResponse)(req, res, console_1.error);
            }
        });
    }
    getMyTurf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!ownerId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                const { page = 1, limit = 4, search = "", status } = req.query;
                const pageNumber = Math.max(Number(page), 1);
                const pageSize = Math.max(Number(limit), 1);
                const searchTerm = typeof search === "string" ? search : "";
                const statusFilter = typeof status === "string" ? status : undefined;
                const { turfs, totalPages } = yield this._getMyTurfUseCase.execute(ownerId, pageNumber, pageSize, searchTerm, statusFilter);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    turfs,
                    totalPages,
                    currentPage: pageNumber,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getTurfById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const turfId = req.params.id;
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!turfId || !ownerId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                    });
                    return;
                }
                const turf = yield this._getTurfByIdUseCase.execute(turfId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    turf,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    updateTurf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const turfId = req.params.id;
                const turfData = req.body;
                if (!turfId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                    });
                    return;
                }
                const isRetryUpdate = turfData.isRetryUpdate || false;
                const retryToken = turfData.retryToken || null;
                delete turfData.isRetryUpdate;
                delete turfData.retryToken;
                delete turfData.status;
                const updatedTurf = yield this._updateTurfUseCase.execute(turfId, turfData, isRetryUpdate, retryToken);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: isRetryUpdate
                        ? constants_1.SUCCESS_MESSAGES.TURF_UPDATED_SUCCESSFULLY
                        : constants_1.SUCCESS_MESSAGES.TURF_RETRY_UPDATED_SUCCESSFULLY,
                    data: updatedTurf,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    generateSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { turfId, date, startTime, endTime, slotDuration, price, selectedDate, endDate, } = req.body;
                console.log("daaaataassssssss", req.body);
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                console.log("ownerrrIDDDD", ownerId, "turfIDDDDD", turfId);
                const slots = yield this._generateSlotsUseCase.execute(turfId, ownerId, date, selectedDate, endDate, startTime, endTime, slotDuration, price);
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: "Slots generated successfully",
                    slots,
                });
            }
            catch (error) {
                console.log(error);
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const turfId = req.params.id;
                const { date } = req.query;
                console.log("turffIDDD", turfId);
                if (!turfId || !date || typeof date !== "string") {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                    });
                    return;
                }
                const dateObj = new Date(date);
                const dayIndex = dateObj.getDay();
                const slots = yield this._getSlotsUseCase.execute(turfId, date, dayIndex);
                console.log("Slotttsssss", slots);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    slots,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getnearbyturfs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { latitude, longitude, page = 1, limit = 10, search = "", } = req.query;
                console.log("latitude", "longitude", latitude, longitude);
                if (!latitude || !longitude) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.LATITUDE_LONGITUDE_REQUIRED,
                    });
                    return;
                }
                const result = yield this._getNearbyTurfsUseCase.execute(parseFloat(latitude), parseFloat(longitude), parseInt(page, 10), parseInt(limit, 10), search);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    turfs: result.turfs,
                    totalPages: result.totalPages,
                });
            }
            catch (error) {
                console.error("Error fetching nearby turfs:", error);
                res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        });
    }
    bookslots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const bookData = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                console.log("userrrrrrID", userId);
                console.log("bookDAAtaaa", bookData.ownerId);
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                console.log("bookdataaaaas", bookData);
                const bookslot = yield this._bookSlotUseCase.execute(bookData, userId);
                yield this._addMoneyOwnerWalletUsecase.execute(bookslot._id);
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.TURF_BOOKED_SUCCESSFULLY,
                    data: bookslot,
                });
            }
            catch (error) {
                console.error("Error in addTurf controller", error);
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                    });
                    return;
                }
                else {
                    res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
                    });
                }
            }
        });
    }
    addrules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const rules = req.body;
                console.log("this are the rules", rules);
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!ownerId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                rules.ownerId = ownerId;
                console.log("rrrrruulless", rules.turfId, rules.slotDuration);
                if (!rules.turfId ||
                    !rules.slotDuration ||
                    !rules.price ||
                    !rules.weeklyRules) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.VALIDATION_ERROR, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                const addedRules = yield this._addRulesUseCase.execute(rules);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: "Rules added or updated successfullly",
                    data: addedRules,
                });
            }
            catch (error) {
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                    });
                }
                else {
                    res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
                    });
                }
            }
        });
    }
    getrules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const turfId = req.params.id;
                if (!turfId) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                    });
                    return;
                }
                const rules = yield this._getRulesUseCase.execute(turfId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    rules,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    checkIsSlotBooked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { turfId, date, startTime, endTime } = req.query;
                const result = yield this._checkSlotIsBookedUseCase.execute(turfId, date, startTime, endTime);
                console.log("result", result);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: "Slot availability checked suuccessfully",
                    result,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    cancelSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { turfId, date, startTime, endTime } = req.body;
                yield this._cancelSlotUseCase.execute({
                    turfId,
                    date,
                    startTime,
                    endTime,
                });
                res.status(200).json({
                    success: true,
                    message: "Slot cancelled successfully",
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    bookslotsoffline(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const bookData = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                console.log("userrrrrrID", userId);
                console.log("bookDAAtaaa", bookData);
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                if (bookData.isOffline === true) {
                    bookData.paymentStatus = "pending";
                    bookData.paymentMethod = "offline";
                }
                console.log("bookdataaaaas", bookData);
                const bookslot = yield this._offlineBookingUseCase.execute(bookData, userId);
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.TURF_BOOKED_SUCCESSFULLY,
                    data: bookslot,
                });
            }
            catch (error) {
                console.error("Error in addTurf controller", error);
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                    });
                }
                else {
                    res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.SERVER_ERROR,
                    });
                }
            }
        });
    }
    addReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { turfId, bookingId, comment } = req.body;
                const review = yield this._addReviewUseCase.execute({
                    userId,
                    turfId,
                    bookingId,
                    comment,
                });
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    review,
                });
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message || "Failed to add review",
                });
            }
        });
    }
    getTurfReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { turfId } = req.params;
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 5);
            const data = yield this._getTurfReviewsUsecase.execute(turfId, page, limit);
            res.status(200).json(Object.assign({ success: true }, data));
        });
    }
    getTurfReviewsForAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { turfId } = req.params;
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 5);
            const result = yield this._getTurfReviewsUsecase.execute(turfId, page, limit);
            res.status(200).json(Object.assign({ success: true }, result));
        });
    }
    deleteReviewAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reviewId } = req.params;
            yield this._deleteReviewUseCase.execute(reviewId);
            res.status(200).json({
                success: true,
                message: "Review deleted successfullt",
            });
        });
    }
    addRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { turfId, bookingId, rating } = req.body;
                const result = yield this._addRatingUseCase.execute({
                    userId,
                    turfId,
                    bookingId,
                    rating,
                });
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    rating: result,
                });
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    success: false,
                    message: error.message || "Failed to add rating",
                });
            }
        });
    }
    getTurfRatings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { turfId } = req.params;
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 5;
                console.log('turffIddddddd', turfId);
                const result = yield this._getTurfRatingUseCase.execute(turfId, page, limit);
                res.status(200).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch turf ratings",
                });
            }
        });
    }
};
exports.TurfController = TurfController;
exports.TurfController = TurfController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetAllTurfsUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetMyTurfsUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetTurfByIdUseCase")),
    __param(3, (0, tsyringe_1.inject)("IUpdateTurfUseCase")),
    __param(4, (0, tsyringe_1.inject)("IGenerateSlotUseCase")),
    __param(5, (0, tsyringe_1.inject)("IGetSlotsUseCase")),
    __param(6, (0, tsyringe_1.inject)("IBookSlotUseCase")),
    __param(7, (0, tsyringe_1.inject)("IGetNearByTurfUseCase")),
    __param(8, (0, tsyringe_1.inject)("IAddRulesUseCase")),
    __param(9, (0, tsyringe_1.inject)("IGetRulesUseCase")),
    __param(10, (0, tsyringe_1.inject)("ICheckSlotIsBookedUseCase")),
    __param(11, (0, tsyringe_1.inject)("ICancelSlotUseCase")),
    __param(12, (0, tsyringe_1.inject)("IOfflineBookingsUseCase")),
    __param(13, (0, tsyringe_1.inject)("IAddMoneyOwnerWalletUseCase")),
    __param(14, (0, tsyringe_1.inject)("IAddReviewUseCase")),
    __param(15, (0, tsyringe_1.inject)("IGetTurfReviewsUseCase")),
    __param(16, (0, tsyringe_1.inject)("IDeleteReviewUseCase")),
    __param(17, (0, tsyringe_1.inject)("IAddRatingUseCase")),
    __param(18, (0, tsyringe_1.inject)("IGetTurfRatingsUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], TurfController);
