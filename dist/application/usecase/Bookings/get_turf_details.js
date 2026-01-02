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
exports.GetBookedTurfDetails = void 0;
const tsyringe_1 = require("tsyringe");
const turf_model_1 = require("../../../interfaceAdapters/database/mongoDb/models/turf_model");
const custom_error_1 = require("../../../domain/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let GetBookedTurfDetails = class GetBookedTurfDetails {
    constructor() { }
    execute(turfId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const turf = yield turf_model_1.TurfModel.findById(turfId);
                if (!turf) {
                    throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.TURF_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
                }
                return turf;
            }
            catch (error) {
                if (error instanceof custom_error_1.CustomError) {
                    throw error;
                }
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.FAILED_TO_FETCH_TURF_DETAILS, constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
        });
    }
};
exports.GetBookedTurfDetails = GetBookedTurfDetails;
exports.GetBookedTurfDetails = GetBookedTurfDetails = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], GetBookedTurfDetails);
