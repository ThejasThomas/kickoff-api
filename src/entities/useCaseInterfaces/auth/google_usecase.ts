import { TRole } from "../../../shared/constants";
import { IClientEntity } from "../../models/client_entity";
import { ITurfOwnerEntity } from "../../models/turfOwner_entity";

export interface IGoogleUseCase {
    execute(
        credential:string,
        client_id:string,
        role:TRole
    ):Promise<Partial<ITurfOwnerEntity | IClientEntity>>;
}
