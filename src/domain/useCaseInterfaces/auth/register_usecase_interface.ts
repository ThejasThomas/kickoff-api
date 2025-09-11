import { UserDTO } from "../../../presentation/dtos/user_dto";
import { IClientEntity } from "../../models/client_entity";
import { ITurfOwnerEntity } from "../../models/turfOwner_entity";

export interface IRegisterUserUseCase {
    execute(
        user:UserDTO,
    ):Promise<ITurfOwnerEntity | IClientEntity |null>
}