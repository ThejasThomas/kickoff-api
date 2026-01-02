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
exports.WalletController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const custom_error_1 = require("../../domain/utils/custom.error");
const error_handler_1 = require("../../shared/utils/error_handler");
const console_1 = require("console");
let WalletController = class WalletController {
    constructor(_addMoneyUseCase, _getWalletBalanceUseCase, _getWalletHistoryUseCase, _getOwnerWalletTransactionUsecase, _getOwnerWalletUseCase, _getAdminWalletUseCase, _getAdminWalletTransactionUseCase, _getAllOwnersTransactionsUsecase, _getTrasactionDetailsUseCase) {
        this._addMoneyUseCase = _addMoneyUseCase;
        this._getWalletBalanceUseCase = _getWalletBalanceUseCase;
        this._getWalletHistoryUseCase = _getWalletHistoryUseCase;
        this._getOwnerWalletTransactionUsecase = _getOwnerWalletTransactionUsecase;
        this._getOwnerWalletUseCase = _getOwnerWalletUseCase;
        this._getAdminWalletUseCase = _getAdminWalletUseCase;
        this._getAdminWalletTransactionUseCase = _getAdminWalletTransactionUseCase;
        this._getAllOwnersTransactionsUsecase = _getAllOwnersTransactionsUsecase;
        this._getTrasactionDetailsUseCase = _getTrasactionDetailsUseCase;
    }
    addMoney(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { amount, reason } = req.body;
                console.log("heylloooo its amount", amount);
                if (!userId) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.UNAUTHORIZED);
                }
                if (!amount || amount <= 0) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.AMOUNT_MUST_BE_POSITIVE, constants_1.HTTP_STATUS.BAD_REQUEST);
                }
                const result = yield this._addMoneyUseCase.execute(userId, Number(amount), reason || "Wallet top up");
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: "Money added to wallet successfully",
                    data: result,
                });
            }
            catch (_b) {
                (0, error_handler_1.handleErrorResponse)(req, res, console_1.error);
            }
        });
    }
    getWalletBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                console.log("userrIDDD", userId);
                const balance = yield this._getWalletBalanceUseCase.execute(userId);
                res.status(200).json({
                    success: true,
                    balance,
                });
            }
            catch (_a) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch wallet balance",
                });
            }
        });
    }
    getWalletHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 5;
                const { transactions, total } = yield this._getWalletHistoryUseCase.execute(userId, page, limit);
                res.status(200).json({
                    success: true,
                    transactions: transactions,
                    total,
                    page,
                    limit,
                });
            }
            catch (_a) {
                res.status(500).json({
                    success: false,
                    message: "failed to fetch wallet history",
                });
            }
        });
    }
    getOwnerWalletTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 5;
                const result = yield this._getOwnerWalletTransactionUsecase.execute(ownerId, page, limit);
                res.status(constants_1.HTTP_STATUS.OK).json(Object.assign({ success: true, message: constants_1.SUCCESS_MESSAGES.WALLET_TRANSACTION_FETCHED }, result));
            }
            catch (error) {
                console.log(error);
                res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constants_1.ERROR_MESSAGES.WALLET_TRANSACTION_FETCH_FAILED,
                });
            }
        });
    }
    getOwnerWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const wallet = yield this._getOwnerWalletUseCase.execute(ownerId);
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                wallet,
            });
        });
    }
    getAdminwallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this._getAdminWalletUseCase.execute();
            res.status(constants_1.HTTP_STATUS.OK).json({
                success: true,
                wallet,
            });
        });
    }
    getAdminWalletTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit) || 10;
            const result = yield this._getAdminWalletTransactionUseCase.execute(page, limit);
            res.status(constants_1.HTTP_STATUS.OK).json(Object.assign({ success: true, message: constants_1.SUCCESS_MESSAGES.ADMIN_WALLET_FETCHED_SCCESSFULLY }, result));
        });
    }
    getAllOwnersTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const data = yield this._getAllOwnersTransactionsUsecase.execute(page, limit);
                console.log('data', data);
                res.status(constants_1.HTTP_STATUS.OK).json(Object.assign({ success: true }, data));
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getTransactionDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = req.params;
                const data = yield this._getTrasactionDetailsUseCase.execute(transactionId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    data,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.WalletController = WalletController;
exports.WalletController = WalletController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IAddMoneyUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetWalletBalanceUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetWalletHistoryUseCase")),
    __param(3, (0, tsyringe_1.inject)("IGetOwnerWalletTransactionsUseCase")),
    __param(4, (0, tsyringe_1.inject)("IGetOwnerWalletUseCase")),
    __param(5, (0, tsyringe_1.inject)("IGetAdminWalletUseCase")),
    __param(6, (0, tsyringe_1.inject)("IAdminWalletTransactionUSeCase")),
    __param(7, (0, tsyringe_1.inject)("IGetAllOwnerWalletTransactionsUseCase")),
    __param(8, (0, tsyringe_1.inject)("IGetTransactionDetailsUseCse")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], WalletController);
