import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { IRuleModel, RuleModel } from "../../database/mongoDb/models/rule_model";
import { IRuleRepository } from "../../../domain/repositoryInterface/Turf/rule_repository_interface";

@injectable()

export class RuleRepository extends BaseRepository<IRuleModel> implements IRuleRepository{
    constructor(){
        super(RuleModel)
    }

    async findExpetionalDates(turfId: string, date: string): Promise<boolean> {
        console.log('turf/idd',turfId)
        const rule = await RuleModel.findOne({turfId});

        const isExceptional =rule?.exceptions.some((exec) =>exec.date ===date)??false
        console.log('isExceptional',rule?.exceptions)
        console.log(isExceptional)
        return isExceptional;

        
    }
}