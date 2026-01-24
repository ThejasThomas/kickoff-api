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
exports.createHostedGameUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const capacityMap = {
    "5x5": 10,
    "6x6": 12,
    "7x7": 14,
    "11x11": 22,
};
let createHostedGameUseCase = class createHostedGameUseCase {
    constructor(_hostedGameRepo, _createChatGroupUseCase) {
        this._hostedGameRepo = _hostedGameRepo;
        this._createChatGroupUseCase = _createChatGroupUseCase;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!data.courtType || !capacityMap[data.courtType]) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_COURT_TYPE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            let turfId = data.turfId;
            let slotDate = data.slotDate;
            let startTime = data.startTime;
            let endTime = data.endTime;
            const existingGame = yield this._hostedGameRepo.findBySlot(turfId, slotDate, startTime, endTime);
            if (existingGame) {
                throw new custom_error_1.CustomError("Slot already hosted for this turf and time. Choose another slot.", constants_1.HTTP_STATUS.CONFLICT);
            }
            const capacity = capacityMap[data.courtType];
            const gameStartAt = moment_timezone_1.default
                .tz(`${data.slotDate} ${data.startTime}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata")
                .utc()
                .toDate();
            const gameData = Object.assign(Object.assign({}, data), { capacity, status: "open", gameStartAt, players: [
                    {
                        userId: data.hostUserId,
                        status: "paid",
                        paymentId: (_a = data.sessionId) !== null && _a !== void 0 ? _a : undefined,
                        joinedAt: new Date().toISOString(),
                    },
                ] });
            const game = yield this._hostedGameRepo.createGame(gameData);
            yield this._createChatGroupUseCase.execute({
                hostedGameId: game._id.toString(),
                hostUserId: data.hostUserId,
            });
            return game;
        });
    }
};
exports.createHostedGameUseCase = createHostedGameUseCase;
exports.createHostedGameUseCase = createHostedGameUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IHostedGameRepository")),
    __param(1, (0, tsyringe_1.inject)("ICreateChatGroupUseCase")),
    __metadata("design:paramtypes", [Object, Object])
], createHostedGameUseCase);
