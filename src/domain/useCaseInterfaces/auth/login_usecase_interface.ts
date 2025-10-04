import { LoginUserDTO } from "../../../application/dtos/user_dto";
import { IAdminEntity } from "../../models/admin_entity";
import { IClientEntity } from "../../models/client_entity";
import { ITurfOwnerEntity } from "../../models/turfOwner_entity";

export interface ILoginUserUseCase {
    execute(
        user:LoginUserDTO

    ):Promise<Partial<ITurfOwnerEntity | IAdminEntity |IClientEntity>>
}