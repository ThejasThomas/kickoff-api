import { CancellationRequestDTO } from "../../../application/dtos/cancellation_request_dto";

export interface IGetCancelRequestsUseCase {
    execute(ownerId:string,page:number,limit:number):Promise<{requests:CancellationRequestDTO[];total:number;page:number;limit:number;totalPages:number}>
}