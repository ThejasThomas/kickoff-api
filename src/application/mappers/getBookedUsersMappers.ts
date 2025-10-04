import { IClientEntity } from "../../domain/models/client_entity";
import { GetBookedUserDetailsDTO } from "../dtos/getBookedUserDetails_dto";

export function mapBookedUsersDetails(entity:IClientEntity):GetBookedUserDetailsDTO{
    return{
        fullName:entity.fullName,
        email:entity.email,
        phoneNumber:entity.phoneNumber
    }
}