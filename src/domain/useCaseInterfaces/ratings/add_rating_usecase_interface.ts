import { IRatingEntity } from "../../models/rating_entity";

export interface IAddRatingUseCase {
    execute(data:{
        userId:string;
        turfId:string;
        bookingId:string;
        rating:number;
    }):Promise<IRatingEntity>
}