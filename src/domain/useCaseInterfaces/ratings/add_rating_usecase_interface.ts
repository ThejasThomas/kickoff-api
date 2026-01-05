import { IRatingDTO } from "../../../application/dtos/rating_dto";

export interface IAddRatingUseCase {
    execute(data:{
        userId:string;
        turfId:string;
        bookingId:string;
        rating:number;
    }):Promise<IRatingDTO>
}