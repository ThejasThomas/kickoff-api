import { AdminDashboardResponseDTO } from "../../../application/dtos/admin_dashboard_dto";
import {  RevenuePeriod } from "../../models/AdminDashboardEntity";

export interface IGetAdminDashboardUseCase {
    execute(period:RevenuePeriod):Promise<AdminDashboardResponseDTO>
}