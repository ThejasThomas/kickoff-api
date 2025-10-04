import { GetBookedUserDetailsDTO } from "../../../application/dtos/getBookedUserDetails_dto";

export interface IGetBookedUsersDetails {
    execute(userId:string):Promise<GetBookedUserDetailsDTO>
}