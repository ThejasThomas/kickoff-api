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
exports.ValidateOwnerService = void 0;
const custom_error_1 = require("../../domain/utils/custom.error");
const constants_1 = require("../../shared/constants");
const tsyringe_1 = require("tsyringe");
let ValidateOwnerService = class ValidateOwnerService {
    constructor(_turfOwnerRepository) {
        this._turfOwnerRepository = _turfOwnerRepository;
    }
    ownerExists(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield this._turfOwnerRepository.findOne({ ownerId });
            return !!owner;
        });
    }
    ownerActive(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield this._turfOwnerRepository.findOne({
                userId: ownerId,
                status: "approved",
            });
            if (!owner) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.OWNER_PERMISSION_DENIED, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            return true;
        });
    }
    findOwner(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield this._turfOwnerRepository.findOne({ userId: ownerId });
            if (!owner) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.OWNER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            //    if (owner.status !== 'active' && owner.status !== 'approved'){
            //         throw new CustomError(ERROR_MESSAGES.OWNER_NOT_ACTIVE,HTTP_STATUS.FORBIDDEN)
            //     }
            return owner;
        });
    }
    updateOwner(ownerId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            const owner = yield this._turfOwnerRepository.findOne({ userId: ownerId });
            if (!owner) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const updatedOwner = yield this._turfOwnerRepository.update({ userId: ownerId }, Object.assign(Object.assign({}, profileData), { updatedAt: new Date() }));
            if (!updatedOwner) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.UPDATE_FAILED, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
            return updatedOwner;
        });
    }
};
exports.ValidateOwnerService = ValidateOwnerService;
exports.ValidateOwnerService = ValidateOwnerService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ITurfOwnerRepository')),
    __metadata("design:paramtypes", [Object])
], ValidateOwnerService);
