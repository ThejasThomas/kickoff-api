import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { IRuleModel, RuleModel } from "../../database/mongoDb/models/rule_model";
import { IRuleRepository } from "../../../domain/repositoryInterface/Turf/rule_repository_interface";

@injectable()

export class RuleRepository extends BaseRepository<IRuleModel> implements IRuleRepository{
    constructor(){
        super(RuleModel)
    }
}