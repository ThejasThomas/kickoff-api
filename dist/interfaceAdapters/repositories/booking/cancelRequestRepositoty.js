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
exports.CancelrequestRepository = void 0;
const tsyringe_1 = require("tsyringe");
const base_repository_1 = require("../base_repository");
const cancellationrequest_model_1 = require("../../database/mongoDb/models/cancellationrequest_model");
const booking_model_1 = require("../../database/mongoDb/models/booking_model");
const client_model_1 = require("../../database/mongoDb/models/client_model");
let CancelrequestRepository = class CancelrequestRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(cancellationrequest_model_1.CancellationRequestModel);
    }
    findByBookingId(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cancellationrequest_model_1.CancellationRequestModel.findOne({ bookingId });
        });
    }
    createRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cancellationrequest_model_1.CancellationRequestModel.create(data);
        });
    }
    getCancelRequestByOwnerId(ownerId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [requests, total] = yield Promise.all([
                cancellationrequest_model_1.CancellationRequestModel.find({ ownerId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                cancellationrequest_model_1.CancellationRequestModel.countDocuments({ ownerId })
            ]);
            const result = [];
            for (const req of requests) {
                const booking = yield booking_model_1.BookinModel.findById(req.bookingId).lean();
                const user = yield client_model_1.ClientModel.findOne({ userId: req.userId }).lean();
                result.push({
                    _id: req._id.toString(),
                    bookingId: req.bookingId,
                    userId: req.userId,
                    ownerId: req.ownerId,
                    reason: req.reason,
                    status: req.status,
                    createdAt: req.createdAt,
                    updatedAt: req.updatedAt,
                    booking: booking
                        ? {
                            date: booking.date,
                            startTime: booking.startTime,
                            endTime: booking.endTime,
                            price: booking.price,
                            turfId: booking.turfId,
                        }
                        : null,
                    user: user
                        ? {
                            name: user.fullName,
                            email: user.email,
                            phone: user.phoneNumber,
                        }
                        : null,
                });
            }
            console.log("resultttt", result);
            return { requests: result, total };
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cancellationrequest_model_1.CancellationRequestModel.findByIdAndUpdate(id, { status }, { new: true });
        });
    }
};
exports.CancelrequestRepository = CancelrequestRepository;
exports.CancelrequestRepository = CancelrequestRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], CancelrequestRepository);
