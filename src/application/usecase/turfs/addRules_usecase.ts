import { inject, injectable } from "tsyringe";
import { IAddRulesUseCase } from "../../../domain/useCaseInterfaces/turfOwner/turfs/add_rules_useCase_interface";
import { IAddRulesDTO } from "../../dtos/add_rules_dto";
import { IRuleService } from "../../../domain/serviceInterfaces/rules_service_interface";

@injectable()

export class AddRulesUseCase implements IAddRulesUseCase {
    constructor(
        @inject('IRuleService') private rulesService:IRuleService
    ){}

    async execute(data: IAddRulesDTO): Promise<IAddRulesDTO> {
        console.log('dataaas,',data)
        
        const addedRules =await this.rulesService.createOrUpdateRules(data)
        return addedRules;
    }
}