import { ITurfEntity } from "../../../models/turf_entity";

export interface IUpdateTurfUseCase {
    execute(turfId:string,TurfData:Partial<ITurfEntity>,isRetryUpdate:boolean,retryToken:string):Promise<ITurfEntity>;
}

