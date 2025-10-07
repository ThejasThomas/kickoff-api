import { IRules } from "../../models/rule_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IRuleRepository extends IBaseRepository<IRules>{

    findExpetionalDates(turfId:string,date:string):Promise<boolean>
    
}