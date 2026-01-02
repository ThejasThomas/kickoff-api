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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../shared/constants");
const error_handler_1 = require("../../shared/utils/error_handler");
const custom_error_1 = require("../../domain/utils/custom.error");
const stripe_1 = __importDefault(require("stripe"));
const hosted_game_schema_1 = require("../../interfaceAdapters/database/mongoDb/schemas/hosted_game_schema");
let UserController = class UserController {
    constructor(_getAllUsersUseCase, __updateEntityStatusUseCase, _getBookedUserDetailsUseCase, _getUserDetailsUseCase, _updateUserDetailsUseCase, _getUserChatGroupsUseCase, _getChatMessageUseCase, _getChatPageDataUseCase) {
        this._getAllUsersUseCase = _getAllUsersUseCase;
        this.__updateEntityStatusUseCase = __updateEntityStatusUseCase;
        this._getBookedUserDetailsUseCase = _getBookedUserDetailsUseCase;
        this._getUserDetailsUseCase = _getUserDetailsUseCase;
        this._updateUserDetailsUseCase = _updateUserDetailsUseCase;
        this._getUserChatGroupsUseCase = _getUserChatGroupsUseCase;
        this._getChatMessageUseCase = _getChatMessageUseCase;
        this._getChatPageDataUseCase = _getChatPageDataUseCase;
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY environment variable is not set");
        }
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    }
    refreshSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = req.user;
                if (!userId || !role) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_TOKEN,
                    });
                    return;
                }
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4, search = "", role, status } = req.query;
                const excludeStatus = req.query["excludeStatus[]"] || req.query.excludeStatus;
                const pageNumber = Math.max(Number(page), 1);
                const pageSize = Math.max(Number(limit), 1);
                const searchTerm = typeof search === "string" ? search : "";
                let excludeStatusArr = [];
                if (typeof excludeStatus === "string") {
                    excludeStatusArr = [excludeStatus];
                }
                else if (Array.isArray(excludeStatus)) {
                    excludeStatusArr = excludeStatus.map(String);
                }
                const roleStr = role === "turfOwner" ? "turfOwner" : "client";
                const { users, totalPages } = yield this._getAllUsersUseCase.execute(roleStr, pageNumber, pageSize, searchTerm, status, excludeStatusArr);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    users,
                    totalPages,
                    currentPage: pageNumber,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const userDetails = yield this._getUserDetailsUseCase.execute(userId);
                res.status(constants_1.HTTP_STATUS.OK).json(userDetails);
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    updateUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const profileDate = req.body;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                    return;
                }
                const updatedProfile = yield this._updateUserDetailsUseCase.execute(userId, profileDate);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
                    data: updatedProfile,
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
                    (0, error_handler_1.handleErrorResponse)(req, res, error);
                }
            }
        });
    }
    updateEntityStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { entityType, entityId, status, reason, email } = req.body;
                const ownerId = req.body.ownerId;
                yield this.__updateEntityStatusUseCase.execute(entityType, entityId, status, reason, email, ownerId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getBookedUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    });
                }
                const userDetails = yield this._getBookedUserDetailsUseCase.execute(userId);
                res.status(constants_1.HTTP_STATUS.OK).json(userDetails);
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    stripePaymentSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, bookingData } = req.body;
                if (!amount || amount <= 0) {
                    res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
                    });
                    return;
                }
                let frontendUrl = process.env.FRONTEND_URL;
                if (!frontendUrl) {
                    console.error("Missing FRONTEND_URL env var");
                    res.status(constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: "Server config error: Missing frontend URL",
                    });
                    return;
                }
                let fullFrontendUrl = frontendUrl;
                if (!fullFrontendUrl.startsWith("http://") && !fullFrontendUrl.startsWith("https://")) {
                    fullFrontendUrl = `http://${fullFrontendUrl}`;
                }
                const essentialMetadata = {
                    turfId: bookingData.turfId,
                    date: bookingData.date,
                    totalAmount: amount.toString(),
                };
                const encodedBookingData = encodeURIComponent(JSON.stringify(bookingData));
                const successUrl = `${fullFrontendUrl}/paymentpage?status=success&session_id={CHECKOUT_SESSION_ID}&bookingData=${encodedBookingData}`;
                const cancelUrl = `${fullFrontendUrl}/paymentpage?status=cancelled`;
                const session = yield this.stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: [
                        {
                            price_data: {
                                currency: "inr",
                                product_data: {
                                    name: "Turf Booking",
                                },
                                unit_amount: Math.round(amount * 100),
                            },
                            quantity: 1,
                        },
                    ],
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                    mode: "payment",
                    metadata: essentialMetadata,
                });
                console.log("SESSION URL=", session.url);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    url: session.url,
                });
            }
            catch (error) {
                console.error("Stripe session creation error", error);
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    verifyPaymentSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('broo heyloooo are u finee??');
                const { id: sessionId } = req.params;
                if (!sessionId) {
                    res.status(400).json({ success: false, message: "Missing session ID" });
                    return;
                }
                const session = yield this.stripe.checkout.sessions.retrieve(sessionId);
                if (session.payment_status !== "paid") {
                    res.status(400).json({ success: false, message: "Payment not paid" });
                    return;
                }
                res.status(200).json({ success: true });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    createWalletCheckoutSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount } = req.body;
                if (!amount || amount <= 0) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid wallet top-up amount",
                    });
                }
                let frontendUrl = process.env.FRONTEND_URL;
                if (!frontendUrl.startsWith("http")) {
                    frontendUrl = `http://${frontendUrl}`;
                }
                const metadata = {
                    purpose: "wallet_topup",
                    amount: amount.toString(),
                };
                const successUrl = `${frontendUrl}/wallet?success=true&amount=${amount}`;
                const cancelUrl = `${frontendUrl}/wallet?success=false`;
                const session = yield this.stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: [
                        {
                            price_data: {
                                currency: "inr",
                                product_data: { name: "Wallet Top-Up" },
                                unit_amount: amount * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: "payment",
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                    metadata,
                });
                res.status(200).json({
                    success: true,
                    url: session.url,
                });
            }
            catch (err) {
                console.error("Wallet checkout session error:", err);
                res.status(500).json({
                    success: false,
                    message: "Failed to start wallet payment"
                });
            }
        });
    }
    createHostedGameCheckoutSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { turfId, slotId, slotDate, startTime, endTime, courtType, pricePerPlayer } = req.body;
                console.log('heyyyyyy broohh');
                if (!turfId || !slotId || !slotDate || !startTime || !endTime || !courtType || !pricePerPlayer) {
                    res.status(400).json({
                        success: false,
                        message: "Missing required game hosting details",
                    });
                    return;
                }
                let frontendUrl = process.env.FRONTEND_URL;
                if (!frontendUrl.startsWith("http")) {
                    frontendUrl = `http://${frontendUrl}`;
                }
                const metadata = {
                    purpose: "host_game",
                    turfId,
                    slotId,
                    slotDate,
                    startTime,
                    endTime,
                    courtType,
                    pricePerPlayer: pricePerPlayer.toString()
                };
                const encodedGameData = encodeURIComponent(JSON.stringify(metadata));
                const successUrl = `${frontendUrl}/host-game-payment?status=success&session_id={CHECKOUT_SESSION_ID}`;
                const cancelUrl = `${frontendUrl}/host-game-payment?status=cancelled`;
                const session = yield this.stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    metadata,
                    line_items: [
                        {
                            price_data: {
                                currency: "inr",
                                product_data: { name: `Host Game (${courtType})` },
                                unit_amount: pricePerPlayer * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    success_url: successUrl.replace("{CHECKOUT_SESSION_ID}", "{CHECKOUT_SESSION_ID}"),
                    cancel_url: cancelUrl,
                });
                res.status(200).json({
                    success: true,
                    url: session.url,
                });
            }
            catch (err) {
                console.error("Hosted game checkout session error:", err);
                res.status(500).json({
                    success: false,
                    message: "Failed to start hosted game payment"
                });
            }
        });
    }
    createJoinHostedGameCheckoutSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gameId } = req.body;
                if (!gameId) {
                    res.status(400).json({
                        success: false,
                        message: "Game ID is required",
                    });
                    return;
                }
                const game = yield hosted_game_schema_1.HostedGameModel.findById(gameId);
                if (!game) {
                    res.status(404).json({
                        success: false,
                        message: "Hosted game not found",
                    });
                    return;
                }
                let frontendUrl = process.env.FRONTEND_URL;
                if (!frontendUrl.startsWith("http")) {
                    frontendUrl = `http://${frontendUrl}`;
                }
                const metadata = {
                    purpose: "join_game",
                    gameId: game._id.toString(),
                    turfId: game.turfId,
                    slotDate: game.slotDate,
                    startTime: game.startTime,
                    endTime: game.endTime,
                    pricePerPlayer: game.pricePerPlayer.toString(),
                };
                const successUrl = `${frontendUrl}/hosted-games/join-hosted-game/${game._id}?status=success&session_id={CHECKOUT_SESSION_ID}`;
                const cancelUrl = `${frontendUrl}/hosted-games/join-hosted-game/${game._id}?status=cancelled`;
                const session = yield this.stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    metadata,
                    line_items: [
                        {
                            price_data: {
                                currency: "inr",
                                product_data: {
                                    name: `Join Game (${game.courtType})`,
                                    description: `${game.slotDate} | ${game.startTime} - ${game.endTime}`,
                                },
                                unit_amount: Math.round(game.pricePerPlayer * 100),
                            },
                            quantity: 1,
                        },
                    ],
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                });
                res.status(200).json({
                    success: true,
                    url: session.url,
                });
            }
            catch (err) {
                console.error("Join hosted game checkout error:", err);
                res.status(500).json({
                    success: false,
                    message: "Failed to start join game payment",
                });
            }
        });
    }
    getMyChatGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                console.log('userrIDDD', userId);
                if (!userId) {
                    res.status(401).json({ success: false });
                    return;
                }
                const groups = yield this._getUserChatGroupsUseCase.execute(userId);
                console.log('groupsss', groups);
                res.status(200).json({
                    success: true,
                    groups,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { groupId } = req.params;
                const data = yield this._getChatPageDataUseCase.execute(groupId);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    group: data.group,
                    messages: data.messages
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetAllUsersUseCase")),
    __param(1, (0, tsyringe_1.inject)("IUpdateEntityStatusUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetBookedUsersDetails")),
    __param(3, (0, tsyringe_1.inject)("IGetUserDetailsUseCase")),
    __param(4, (0, tsyringe_1.inject)("IUpdateUserDetailsUseCase")),
    __param(5, (0, tsyringe_1.inject)("IGetUserChatGroupsUseCase")),
    __param(6, (0, tsyringe_1.inject)("IGetChatMessageUseCase")),
    __param(7, (0, tsyringe_1.inject)("IGetChatPageDataUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], UserController);
