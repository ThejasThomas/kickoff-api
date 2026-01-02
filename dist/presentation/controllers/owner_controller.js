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
exports.TurfOwnerController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const custom_error_1 = require("../../domain/utils/custom.error");
const error_handler_1 = require("../../shared/utils/error_handler");
let TurfOwnerController = class TurfOwnerController {
    constructor(_addTurfUSeCase, _ownerDetailsUseCase, _updateTurfOwnerProfileUseCase, __retryAdminApprovalUseCase, _requestupdateprofile, _getOwnerDashboardUseCase) {
        this._addTurfUSeCase = _addTurfUSeCase;
        this._ownerDetailsUseCase = _ownerDetailsUseCase;
        this._updateTurfOwnerProfileUseCase = _updateTurfOwnerProfileUseCase;
        this.__retryAdminApprovalUseCase = __retryAdminApprovalUseCase;
        this._requestupdateprofile = _requestupdateprofile;
        this._getOwnerDashboardUseCase = _getOwnerDashboardUseCase;
    }
    addTurf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const turfData = req.body;
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!ownerId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                if (!turfData.turfName || !turfData.description || !turfData.location) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.VALIDATION_ERROR,
                    });
                    return;
                }
                const newTurf = yield this._addTurfUSeCase.execute(turfData, ownerId);
                res.status(constants_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.TURF_ADDED_SUCCESSFULLY,
                    data: newTurf,
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
    getOwnerDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!ownerId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                }
                const profile = yield this._ownerDetailsUseCase.execute(ownerId);
                res.status(constants_1.HTTP_STATUS.OK).json(profile);
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    updateTurfOwnerProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const profileData = req.body;
                console.log("profileDate", profileData);
                if (!ownerId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                const updatedProfile = yield this._updateTurfOwnerProfileUseCase.execute(ownerId, profileData);
                console.log("updatedProfile", updatedProfile);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
                    data: updatedProfile,
                });
            }
            catch (error) {
                console.error("Error in updatedTurfprofile contoller", error);
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                    });
                }
                else {
                    (0, error_handler_1.handleErrorResponse)(req, res, error);
                }
            }
        });
    }
    requestUpdateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const profileData = req.body;
                console.log("ownerrrId", ownerId, "Profiledaataa", profileData);
                if (!ownerId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                const updatedProfile = yield this._requestupdateprofile.execute(ownerId, profileData);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
                    data: updatedProfile,
                });
            }
            catch (error) {
                console.error("Error in updatedTurfprofile contoller", error);
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                    });
                }
                else {
                    (0, error_handler_1.handleErrorResponse)(req, res, error);
                }
            }
        });
    }
    retryAdminApproval(req, res) {
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
                const result = yield this.__retryAdminApprovalUseCase.execute(ownerId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.APPROVAL_REQUEST_SENT,
                    data: result,
                });
            }
            catch (error) {
                console.error("Error in retryAdminApproval controller", error);
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                    });
                }
                else {
                    (0, error_handler_1.handleErrorResponse)(req, res, error);
                }
            }
        });
    }
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!ownerId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                    });
                    return;
                }
                const days = req.query.days
                    ? Number(req.query.days) : 7;
                const dashboardDate = yield this._getOwnerDashboardUseCase.execute(ownerId, {
                    dailyDays: days
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES,
                    data: dashboardDate
                });
            }
            catch (error) {
                console.log(error);
                res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to fetch owner dashboard data"
                });
            }
        });
    }
};
exports.TurfOwnerController = TurfOwnerController;
exports.TurfOwnerController = TurfOwnerController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IAddTurfUseCase")),
    __param(1, (0, tsyringe_1.inject)("ITurfOwnerDetailsUseCase")),
    __param(2, (0, tsyringe_1.inject)("IUpdateTurfOwnerProfileUseCase")),
    __param(3, (0, tsyringe_1.inject)("IRetryAdminApprovalUseCase")),
    __param(4, (0, tsyringe_1.inject)("IRequestUpdateProfileUseCase")),
    __param(5, (0, tsyringe_1.inject)("IGetOwnerDashboardUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], TurfOwnerController);
