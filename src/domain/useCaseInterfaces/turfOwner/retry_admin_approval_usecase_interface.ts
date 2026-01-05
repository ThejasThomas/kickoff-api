import { ITurfOwnerDTO } from "../../../application/dtos/turfowner_dto";

export interface IRetryAdminApprovalUseCase {
    execute(ownerId:string):Promise<ITurfOwnerDTO>;
}