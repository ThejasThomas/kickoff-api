import { IClientEntity } from "../../models/client_entity";
import { ITurfOwnerEntity } from "../../models/turfOwner_entity";

export interface IGetAllUsersUseCase{
    execute(userType:string,page:number,limit:number,search:string,status:string,excludeStatus:string[]): Promise<{users:(Omit<IClientEntity,"password"> | Omit<ITurfOwnerEntity,"password">)[],totalPages:number}>
}