import { ITurfEntity } from "../../../models/turf_entity";

export interface IGetNearByTurfUseCase {
    execute(
        latitude:number,
        longitude:number,
        page:number,
        limit:number,
        search:string,
        
    ):Promise<{turfs:Omit<ITurfEntity,"ownerId">[];
        totalPages:number
    }>
}
