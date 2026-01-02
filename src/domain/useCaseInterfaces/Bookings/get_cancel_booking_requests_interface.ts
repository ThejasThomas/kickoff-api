import { ICancellationRequestEntity } from "../../models/cancellationRequest_entity";

export interface IGetCancelRequestsUseCase {
    execute(ownerId:string,page:number,limit:number):Promise<{requests:ICancellationRequestEntity[];total:number;page:number;limit:number;totalPages:number}>
}