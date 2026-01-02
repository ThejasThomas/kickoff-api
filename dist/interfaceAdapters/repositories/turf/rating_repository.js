"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.RatingRepository = void 0;
const tsyringe_1 = require("tsyringe");
const rating_model_1 = require("../../database/mongoDb/models/rating_model");
let RatingRepository = class RatingRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rating = yield rating_model_1.RatingModel.create(data);
            return rating.toObject();
        });
    }
    findByBookingId(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return rating_model_1.RatingModel.findOne({ bookingId }).lean();
        });
    }
    findByBookingIds(bookingIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const ratings = yield rating_model_1.RatingModel.find({ bookingId: { $in: bookingIds } }, { bookingId: 1, _id: 0 }).lean();
            return ratings.map((rating) => rating.bookingId);
        });
    }
    getTurfRatings(turfId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const skip = (page - 1) * limit;
            console.log("turffId", turfId, page, limit);
            const stats = yield rating_model_1.RatingModel.aggregate([
                { $match: { turfId } },
                {
                    $group: {
                        _id: "$turfId",
                        averageRating: { $avg: "$rating" },
                        totalRatings: { $sum: 1 },
                    },
                },
            ]);
            console.log("statsss", stats);
            const ratings = yield rating_model_1.RatingModel.aggregate([
                { $match: { turfId } },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "clients",
                        localField: "userId",
                        foreignField: "userId",
                        as: "user",
                    },
                },
                { $unwind: "$user" },
                {
                    $project: {
                        rating: 1,
                        createdAt: 1,
                        userName: "$user.fullName",
                        _id: 0,
                    },
                },
            ]);
            console.log("ratingsss", ratings);
            return {
                averageRating: ((_a = stats[0]) === null || _a === void 0 ? void 0 : _a.averageRating) || 0,
                totalRating: ((_b = stats[0]) === null || _b === void 0 ? void 0 : _b.totalRatings) || 0,
                ratings,
            };
        });
    }
};
exports.RatingRepository = RatingRepository;
exports.RatingRepository = RatingRepository = __decorate([
    (0, tsyringe_1.injectable)()
], RatingRepository);
