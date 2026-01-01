import { AdminDashboardEntity, RevenuePeriod } from "../../models/AdminDashboardEntity";

export interface IGetAdminDashboardUseCase {
    execute(period:RevenuePeriod):Promise<AdminDashboardEntity>
}