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
exports.UpdateEntityStatusUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const constants_1 = require("../../../shared/constants");
const custom_error_1 = require("../../../domain/utils/custom.error");
const hasEmail_1 = require("../../../shared/helper/hasEmail");
const config_1 = require("../../../shared/config");
let UpdateEntityStatusUseCase = class UpdateEntityStatusUseCase {
    constructor(_clientRepository, _turfOwnerRepository, _tokenService, __turfRepository, _emailService) {
        this._clientRepository = _clientRepository;
        this._turfOwnerRepository = _turfOwnerRepository;
        this._tokenService = _tokenService;
        this.__turfRepository = __turfRepository;
        this._emailService = _emailService;
    }
    execute(entityType, entityId, status, reason, email, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!entityType || !entityId || !status) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.VALIDATION_ERROR, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            let repo;
            let entityLabel;
            switch (entityType) {
                case "client":
                    repo = this._clientRepository;
                    entityLabel = "client";
                    break;
                case "turfOwner":
                    repo = this._turfOwnerRepository;
                    entityLabel = "Turf Owner";
                    break;
                case "turf":
                    repo = this.__turfRepository;
                    entityLabel = "turf";
                    break;
                default:
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ROLE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const entity = yield repo.findOne({ _id: entityId });
            if (!entity) {
                throw new custom_error_1.CustomError(`${entityType} ${constants_1.ERROR_MESSAGES.USER_NOT_FOUND}`, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            yield repo.update({ _id: entityId }, { status });
            if (entityType === "turfOwner" &&
                status === "rejected" &&
                reason &&
                (0, hasEmail_1.hasEmail)(entity)) {
                yield this._handleRejection(entity.email, reason, entityType, entityLabel);
            }
            if (entityType === "turfOwner" &&
                status === "approved" &&
                (0, hasEmail_1.hasEmail)(entity)) {
                yield this._handleApproval(entity.email, entityType, entityLabel);
            }
            if (entityType === "turf" && ownerId) {
                const turfEntity = entity;
                yield this._handleTurfStatusUpdate(ownerId, status, reason || "", turfEntity.turfName || "Your Turf", entityId);
            }
        });
    }
    _handleTurfStatusUpdate(ownerId, status, reason, turfName, turfId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const owner = yield this._turfOwnerRepository.findOne({ userId: ownerId });
                if (!owner || !(0, hasEmail_1.hasEmail)(owner)) {
                    console.log(`owner not found or has no email for ID:${ownerId}`);
                    return;
                }
                if (status === 'rejected' && reason) {
                    yield this._handleTurfRejection(owner.email, reason, turfName || "Your turf", turfId);
                }
            }
            catch (error) {
                console.error(`❌ Failed to handle turf status update for owner ${ownerId}:`, error);
                return;
            }
        });
    }
    _handleTurfRejection(email, reason, turfName, turfId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const retryToken = this._tokenService.generateResetToken(email);
                const retryUrl = `${config_1.config.cors.ALLOWED_ORIGIN}/turfOwner/retryedit-turf/${turfId}?retry_token=${retryToken}`;
                yield this._emailService.sendTurfRejectionEmail(email, reason, turfName, retryUrl);
                console.log(`✅ Turf rejection email sent to: ${email} for turf: ${turfName}`);
            }
            catch (error) {
                console.error(`❌ Failed to send turf rejection email to ${email}:`, error);
            }
        });
    }
    _handleRejection(email, reason, entityType, entityLabel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let retryUrl = null;
                if (entityType === "turfOwner") {
                    const retryToken = this._tokenService.generateResetToken(email);
                    retryUrl = `${config_1.config.cors.ALLOWED_ORIGIN}/turfOwner/request-updatedpage?retry_token=${retryToken}`;
                }
                yield this._emailService.sendRejectionEmail(email, reason, retryUrl, entityLabel);
                console.log(`✅ Rejection email sent to ${entityLabel}: ${email}`);
            }
            catch (error) {
                console.error(`❌ Failed to send rejection email to ${email}:`, error);
            }
        });
    }
    _handleApproval(email, entityType, entityLabel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let retryUrl: string | null = null;
                // if (entityType === "turfOwner") {
                //   const retryToken = this._tokenService.generateResetToken(email);
                //   retryUrl = `${config.cors.ALLOWED_ORIGIN}/turfOwner/request-updatedpage?retry_token=${retryToken}`;
                // }
                yield this._emailService.sendApprovalEmail(email, 
                // reason,
                // retryUrl,
                entityLabel);
                console.log(`✅ Approval email sent to ${entityLabel}: ${email}`);
            }
            catch (error) {
                console.error(`❌ Failed to send Approval email to ${email}:`, error);
            }
        });
    }
};
exports.UpdateEntityStatusUseCase = UpdateEntityStatusUseCase;
exports.UpdateEntityStatusUseCase = UpdateEntityStatusUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IClientRepository")),
    __param(1, (0, tsyringe_1.inject)("ITurfOwnerRepository")),
    __param(2, (0, tsyringe_1.inject)("ITokenService")),
    __param(3, (0, tsyringe_1.inject)("ITurfRepository")),
    __param(4, (0, tsyringe_1.inject)("IEmailService")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], UpdateEntityStatusUseCase);
