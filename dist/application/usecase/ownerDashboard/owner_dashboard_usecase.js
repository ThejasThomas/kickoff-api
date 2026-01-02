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
exports.GetOwnerDashboardUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let GetOwnerDashboardUseCase = class GetOwnerDashboardUseCase {
    constructor(_dashboardRepo) {
        this._dashboardRepo = _dashboardRepo;
    }
    execute(ownerId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dailyDays = (_a = options === null || options === void 0 ? void 0 : options.dailyDays) !== null && _a !== void 0 ? _a : 7;
            const [bookingOverview, perTurfStats, dailyBookings, monthlyBookings, yearlyBookings, hostedOverview, hostedDaily, hostedMonthly, hostedYearly] = yield Promise.all([
                this._dashboardRepo.getOwnerOverview(ownerId),
                this._dashboardRepo.getPerTurfStats(ownerId),
                this._dashboardRepo.getDailyStats(ownerId, dailyDays),
                this._dashboardRepo.getMonthlyStats(ownerId),
                this._dashboardRepo.getYearlyStats(ownerId),
                this._dashboardRepo.getHostedGamesOverview(ownerId),
                this._dashboardRepo.getHostedGamesDailyStats(ownerId, dailyDays),
                this._dashboardRepo.getHostedGamesMonthlyStats(ownerId),
                this._dashboardRepo.getHostedGamesYearlyStats(ownerId)
            ]);
            return {
                overview: {
                    totalBookings: bookingOverview.totalBookings,
                    totalRevenue: bookingOverview.totalRevenue,
                    totalHostedGames: hostedOverview.totalGames,
                    totalHostedRevenue: hostedOverview.totalRevenue,
                    totalPlayers: hostedOverview.totalPlayers
                },
                perTurf: perTurfStats,
                bookings: {
                    daily: dailyBookings,
                    monthly: monthlyBookings,
                    yearly: yearlyBookings
                },
                hostedGames: {
                    overview: hostedOverview,
                    daily: hostedDaily,
                    monthly: hostedMonthly,
                    yearly: hostedYearly
                }
            };
        });
    }
};
exports.GetOwnerDashboardUseCase = GetOwnerDashboardUseCase;
exports.GetOwnerDashboardUseCase = GetOwnerDashboardUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IOwnerDashboardRepository")),
    __metadata("design:paramtypes", [Object])
], GetOwnerDashboardUseCase);
