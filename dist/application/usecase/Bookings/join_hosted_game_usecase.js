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
exports.JoinHostedGameUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let JoinHostedGameUseCase = class JoinHostedGameUseCase {
    constructor(_hostedGameRepository, _chatGroupRepository) {
        this._hostedGameRepository = _hostedGameRepository;
        this._chatGroupRepository = _chatGroupRepository;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gameId, userId } = data;
            const game = yield this._hostedGameRepository.getById(gameId);
            if (!game) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.NOT_GAME_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            if (game.hostUserId === userId) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.CANNOT_JOIN_OWN_GAME, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            if (game.status === "full") {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.GAME_IS_FULL, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const success = yield this._hostedGameRepository.joinGame(gameId, userId);
            if (!success) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.ALREADY_JOINED, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const chatGroup = yield this._chatGroupRepository.findByHostedGameId(gameId);
            if (!chatGroup) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.CHAT_GROUP_NOT_FOUND, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            yield this._chatGroupRepository.addMember(chatGroup._id.toString(), userId);
            return {
                success: true,
                message: "You joined game successfully"
            };
        });
    }
};
exports.JoinHostedGameUseCase = JoinHostedGameUseCase;
exports.JoinHostedGameUseCase = JoinHostedGameUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IHostedGameRepository")),
    __param(1, (0, tsyringe_1.inject)("IChatGroupRepository")),
    __metadata("design:paramtypes", [Object, Object])
], JoinHostedGameUseCase);
