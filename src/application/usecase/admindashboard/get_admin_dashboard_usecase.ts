import { inject, injectable } from "tsyringe";
import { IGetAdminDashboardUseCase } from "../../../domain/useCaseInterfaces/admindashboard/get_admin_dashboard_usecase_interface";
import {  RevenuePeriod } from "../../../domain/models/AdminDashboardEntity";
import { IAdminDashboardRepository } from "../../../domain/repositoryInterface/admindashboard/admin_dashboard_repository_interface";
import { AdminDashboardResponseDTO } from "../../dtos/admin_dashboard_dto";

@injectable()
export class GetAdminDashboardUseCase implements IGetAdminDashboardUseCase{
    constructor(
        @inject("IAdminDashboardRepository")
        private _dashboardRepo:IAdminDashboardRepository
    ){}

    async execute(period: RevenuePeriod): Promise<AdminDashboardResponseDTO> {
        const [users,turfs,owners,bookings,revenue]=await Promise.all([
            this._dashboardRepo.getUsersStats(),
            this._dashboardRepo.getTurfStats(),
            this._dashboardRepo.getOwnerStats(),
            this._dashboardRepo.getBookingStats(),
            this._dashboardRepo.getRevenueAnalytics(period)
        ])

        return {
            users,
            turfs,
            owners,
            bookings,
            revenue:{
                period,
                ...revenue
            }
        }
    }
}