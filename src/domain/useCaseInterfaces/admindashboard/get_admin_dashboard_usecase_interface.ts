import { inject } from "tsyringe";
import { IAdminDashboardRepository } from "../../repositoryInterface/admindashboard/admin_dashboard_repository_interface";
import { AdminDashboardEntity, RevenuePeriod } from "../../models/AdminDashboardEntity";

export interface IGetAdminDashboardUseCase {
    execute(period:RevenuePeriod):Promise<AdminDashboardEntity>
}