import { inject, injectable } from "tsyringe";
import { ITurfRepository } from "../../domain/repositoryInterface/Turf/turf_repository_interface";
import { ITurfEntity } from "../../domain/models/turf_entity";
import { IGetMyTurfsUseCase } from "../../domain/useCaseInterfaces/turfs/get_my_turf_usecase_interface";

@injectable()
export class GetMyTurfsUseCase implements IGetMyTurfsUseCase {
  constructor(
    @inject("ITurfRepository")
    private _turfRepository: ITurfRepository
  ) {}

  async execute(
    ownerId: string,
    page: number,
    limit: number,
    search: string = "",
    status?: string
  ): Promise<{ turfs: ITurfEntity[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter: any = { ownerId }; 

    if (search) {
      filter.$or = [
        { turfName: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const sortOptions = { createdAt: -1 };
    console.log('daaataas',filter,skip,limit,sortOptions)
    const { items, total } = await this._turfRepository.findAll(
      filter,
      skip,
      limit,
      sortOptions,
    );
    console.log("items",items,'total',total)

    type SanitizedTurf = Omit<ITurfEntity, never>;
    const sanitizedTurfs: SanitizedTurf[] = items.map((turf) => {
      const { id, ...rest } = turf;
      return { _id: (id ?? "").toString(), ...rest } as SanitizedTurf;
    });

    return {
      turfs: sanitizedTurfs,
      totalPages: Math.ceil(total / limit),
    };
  }
}