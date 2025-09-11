import { ITurfOwnerEntity } from "../../models/turfOwner_entity"

export interface IRetryAdminApprovalUseCase {
    execute(ownerId:string):Promise<ITurfOwnerEntity>;
}