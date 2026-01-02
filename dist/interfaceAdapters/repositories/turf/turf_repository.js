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
exports.TurfRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base_repository");
const turf_model_1 = require("../../database/mongoDb/models/turf_model");
let TurfRepository = class TurfRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(turf_model_1.TurfModel);
    }
    findNearbyTurfs(latitude_1, longitude_1) {
        return __awaiter(this, arguments, void 0, function* (latitude, longitude, maxDistance = 1000, filter, skip = 0, limit = 10, sortOptions = { createdAt: -1 }) {
            var _a;
            const pipeline = [
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [longitude, latitude],
                        },
                        distanceField: "distance",
                        maxDistance: maxDistance,
                        spherical: true,
                        query: Object.assign(Object.assign({}, filter), { status: "approved" }),
                    },
                },
                {
                    $sort: sortOptions,
                },
            ];
            const [result] = yield turf_model_1.TurfModel.aggregate([
                ...pipeline,
                {
                    $facet: {
                        items: [{ $skip: skip }, { $limit: limit }],
                        total: [{ $count: "count" }],
                    },
                },
            ]).exec();
            const items = result.items || [];
            const total = ((_a = result.total[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            return { items, total };
        });
    }
    getTurfById(turfId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield turf_model_1.TurfModel.findById(turfId);
        });
    }
};
exports.TurfRepository = TurfRepository;
exports.TurfRepository = TurfRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], TurfRepository);
