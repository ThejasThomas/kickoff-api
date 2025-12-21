import { Request, Response } from "express";
import { IAdminController } from "../../domain/controllerInterfaces/admin/admin_dashboard_controller_interface";
import { RevenuePeriod } from "../../domain/models/AdminDashboardEntity";
import { inject, injectable } from "tsyringe";
import { IGetAdminDashboardUseCase } from "../../domain/useCaseInterfaces/admindashboard/get_admin_dashboard_usecase_interface";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class AdminController implements IAdminController{
    constructor(
        @inject("IGetAdminDashboardUseCase")
        private _getAdminDashboardUseCase:IGetAdminDashboardUseCase
    ){}
    async adminDashboard(req: Request, res: Response): Promise<void> {
        try{
            const period =(req.query.period as RevenuePeriod);
            console.log('periood',period)

            const dashboardData=await this._getAdminDashboardUseCase.execute(period)

            res.status(HTTP_STATUS.OK).json({
                success:true,
                data:dashboardData
            })
        }
        catch(error){
            console.log(error)
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"Failed to load admin dashboard"
            })
        }
    }
}