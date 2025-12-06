import { ICancellationRequestEntity } from "../../models/cancellationRequest_entity";

export interface IGetCancelRequestsUseCase {
    execute(ownerId:string):Promise<ICancellationRequestEntity[]>
}