import { ITurfEntity } from "../../../models/turf_entity";

export interface IGetAllTurfsUseCase {
  execute(
    page: number,
    limit: number,
    search: string,
    status: string,
    // excludeStatus: string[]
  ): Promise<{
    turfs: Omit<ITurfEntity, "ownerId">[];
    totalPages: number;
  }>;
}
