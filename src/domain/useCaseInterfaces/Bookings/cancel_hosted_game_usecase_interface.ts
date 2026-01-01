import { ICancellationRequestEntity } from "../../models/cancellationRequest_entity";

export interface IRequestHostedGameCancelUseCase{
    execute(userId:string,hostedGameId:string,reason:string):Promise<ICancellationRequestEntity>
}