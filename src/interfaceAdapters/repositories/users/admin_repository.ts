import { injectable } from "tsyringe";
// import { constructor } from "chalk";
import { AdminModel, IAdminModel } from "../../database/mongoDb/models/admin_model";
import { BaseRepository } from "../../../interfaceAdapters/repositories/base_repository";

@injectable()
export class  AdminRepository extends BaseRepository<IAdminModel>{
    constructor(){
        super(AdminModel)
    }
}