import { GetUserDetailsDTO } from "../../../application/dtos/get_userdetails_dto";

export interface IGetUserDetailsUseCase {
    execute(userId:string):Promise<GetUserDetailsDTO>
}