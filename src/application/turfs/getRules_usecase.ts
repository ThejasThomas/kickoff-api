import { inject, injectable } from "tsyringe";
import { IGetRulesUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_rules_useCase_interface";
import { IRules } from "../../domain/models/rule_entity";
import { IRuleRepository } from "../../domain/repositoryInterface/Turf/rule_repository_interface";
import { IBookingRepository } from "../../domain/repositoryInterface/booking/booking_repository_interface";

@injectable()

export class GetRulesUseCase implements IGetRulesUseCase{
    constructor(
        @inject('IRuleRepository')
        private _ruleRepository:IRuleRepository,
        @inject('IBookingRepository')
        private _bookingRepository:IBookingRepository

    ){}
    async execute(turfId: string): Promise<IRules> {
        console.log('turfffIDDD',turfId)
        
        const filter ={turfId}

        const rules=await this._ruleRepository.findOne(filter);

       if (!rules) {
        return {
            turfId,
            weeklyRules: [{ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }],
            exceptions: [],
            slotDuration: 1,
            price: 0,
            ownerId: "",  
        };
    }
        return rules;
    }
}

