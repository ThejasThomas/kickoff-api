import { IAddRulesDTO } from "../../../../application/dtos/add_rules_dto";

export interface IAddRulesUseCase {
    execute(data:IAddRulesDTO):Promise<IAddRulesDTO>
}