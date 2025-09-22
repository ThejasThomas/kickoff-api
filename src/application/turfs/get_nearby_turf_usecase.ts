import { inject, injectable } from "tsyringe";
import { IGetNearByTurfUseCase } from "../../domain/useCaseInterfaces/turfs/get_nearby_turf_usecase_interface";
import { ITurfRepository } from "../../domain/repositoryInterface/Turf/turf_repository_interface";
import { ITurfEntity } from "../../domain/models/turf_entity";

@injectable()
export class GetNearbyTurfsUseCase implements IGetNearByTurfUseCase {
    constructor(
        @inject('ITurfRepository')
        private _turfRepository:ITurfRepository
    ) {}

    async execute(latitude: number, longitude: number, page: number, limit: number, search: string): Promise<{ turfs: Omit<ITurfEntity, "ownerId">[]; totalPages: number; }> {
        console.log('heyloooo brotherr',latitude,longitude,page,limit,search)
        const skip =(page-1) * limit;
        const filter:any ={};

        if(search) {
            filter.$or = [
                {turfName:{$regex:search,$options:"i"}},
                {"location.city":{$regex:search,$options:"i"}},
            ];
        }

        const {items,total} =await this._turfRepository.findNearbyTurfs(
            latitude,
            longitude,
            10000,
            filter,
            skip,
            limit,
        )
        type SanitizedTurf =Omit<ITurfEntity,"ownerId"> & { _id:string};

        const SanitizedTurfs:SanitizedTurf[] =items.map((turf)=>{
            const {ownerId,id,...rest} =turf;
            return {_id:(id ?? "").toString(),...rest} as SanitizedTurf
        })

        return {
            turfs:SanitizedTurfs,
            totalPages:Math.ceil(total/limit)
        }

    }
}