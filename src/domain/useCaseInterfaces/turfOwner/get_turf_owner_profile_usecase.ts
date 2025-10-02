import { IOwnerDTO } from "../../../presentation/dtos/owner_dto";
import { ITurfOwnerEntity } from "../../models/turfOwner_entity";

export interface ITurfOwnerDetailsUseCase{
    execute(ownerId:string):Promise<IOwnerDTO>
}