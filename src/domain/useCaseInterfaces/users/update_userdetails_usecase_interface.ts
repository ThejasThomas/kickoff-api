import { GetUserDetailsDTO } from "../../../application/dtos/get_userdetails_dto";

export interface IUpdateUserDetailsUseCase {
    execute(userId:string,profileData:GetUserDetailsDTO):Promise<void>
}