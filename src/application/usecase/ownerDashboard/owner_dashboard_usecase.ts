import { inject, injectable } from "tsyringe";
import { IGetOwnerDashboardUseCase } from "../../../domain/useCaseInterfaces/ownerDashboard/owner_dashboard_usecase";
import { IOwnerDashboardRepository } from "../../../domain/repositoryInterface/ownerDashboard/owner_dashboard_repository_interface";

@injectable()
export class GetOwnerDashboardUseCase
  implements IGetOwnerDashboardUseCase
{
  constructor(
    @inject("IOwnerDashboardRepository")
    private _dashboardRepo: IOwnerDashboardRepository
  ) {}

  async execute(
    ownerId: string,
    options?: { dailyDays?: number }
  ) {
    const dailyDays = options?.dailyDays ?? 7;

    const [
      bookingOverview,
      perTurfStats,
      dailyBookings,
      monthlyBookings,
      yearlyBookings,
      hostedOverview,
      hostedDaily,
      hostedMonthly,
      hostedYearly
    ] = await Promise.all([
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
  }
}
