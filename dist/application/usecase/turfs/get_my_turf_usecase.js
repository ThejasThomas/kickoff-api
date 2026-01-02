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
exports.GetMyTurfsUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const getTurfMappers_1 = require("../../mappers/getTurfMappers");
let GetMyTurfsUseCase = class GetMyTurfsUseCase {
    constructor(_turfRepository) {
        this._turfRepository = _turfRepository;
    }
    execute(ownerId_1, page_1, limit_1) {
        return __awaiter(this, arguments, void 0, function* (ownerId, page, limit, search = "", status) {
            const skip = (page - 1) * limit;
            const filter = { ownerId };
            if (search) {
                filter.$or = [
                    { turfName: { $regex: search, $options: "i" } },
                    { "location.address": { $regex: search, $options: "i" } },
                ];
            }
            if (status && status !== "all") {
                filter.status = status;
            }
            const sortOptions = { createdAt: -1 };
            const { items, total } = yield this._turfRepository.findAll(filter, skip, limit, sortOptions);
            console.log('itmes', items);
            const myturfs = items.map(getTurfMappers_1.mapGetTurfDTO);
            if (myturfs.length === 0 && total === 0) {
                console.log('No turfs found for filter:', filter);
            }
            return {
                turfs: myturfs,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
};
exports.GetMyTurfsUseCase = GetMyTurfsUseCase;
exports.GetMyTurfsUseCase = GetMyTurfsUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ITurfRepository")),
    __metadata("design:paramtypes", [Object])
], GetMyTurfsUseCase);
