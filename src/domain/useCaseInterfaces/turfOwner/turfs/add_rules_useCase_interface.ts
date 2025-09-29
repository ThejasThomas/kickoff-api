import { IAddRulesDTO } from "../../../../presentation/dtos/add_rules_dto";

export interface IAddRulesUseCase {
    execute(data:IAddRulesDTO):Promise<IAddRulesDTO>
}