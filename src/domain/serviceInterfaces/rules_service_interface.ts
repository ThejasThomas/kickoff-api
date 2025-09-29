import { IAddRulesDTO } from "../../presentation/dtos/add_rules_dto";
import { IRules } from "../models/rule_entity";

export interface IRuleService {
    createOrUpdateRules(data:IRules):Promise<IRules>
}