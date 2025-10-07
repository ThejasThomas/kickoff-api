import { IOwnerDTO } from "../../../application/dtos/owner_dto";

export interface ITurfOwnerDetailsUseCase{
    execute(ownerId:string):Promise<IOwnerDTO>
}