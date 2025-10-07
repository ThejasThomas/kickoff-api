import { IRules } from "../../../models/rule_entity";

export interface IGetRulesUseCase{
    execute(turfId:string):Promise<IRules>
}
