import { IClientEntity } from "../../domain/models/client_entity";
import { GetUserDetailsDTO } from "../dtos/get_userdetails_dto";

export function mapGetUserDetails(entity:IClientEntity):GetUserDetailsDTO{
    return{
        fullName:entity.fullName,
        email:entity.email,
        phoneNumber:entity.phoneNumber
    }
}