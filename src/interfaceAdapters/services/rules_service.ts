import { injectable } from "tsyringe";
import { IRuleService } from "../../domain/serviceInterfaces/rules_service_interface";
import { IRules } from "../../domain/models/rule_entity";
import { RuleModel } from "../database/mongoDb/models/rule_model";

@injectable()
export class RulesService implements IRuleService {
    async createOrUpdateRules(data: IRules): Promise<IRules> {
        const rules =await RuleModel.findOneAndUpdate(
            {turfId:data.turfId},
            data,
            {upsert:true,new:true}
        );
        return rules;
    }
}