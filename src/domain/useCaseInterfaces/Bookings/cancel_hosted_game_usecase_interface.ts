import { CancellationRequestDTO } from "../../../application/dtos/cancellation_request_dto";

export interface IRequestHostedGameCancelUseCase{
    execute(userId:string,hostedGameId:string,reason:string):Promise<CancellationRequestDTO>
}