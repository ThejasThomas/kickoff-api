import { model } from "mongoose";
import { IRules } from "../../../../domain/models/rule_entity";
import { RulesSchema } from "../schemas/rule_schema";

export interface IRuleModel extends IRules{

}

export const RuleModel=model<IRules>('Rules',RulesSchema)