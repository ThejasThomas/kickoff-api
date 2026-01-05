import { ITurfResponseDTO } from "../../../../application/dtos/turf_dto_response";

export interface IGetAllTurfsUseCase {
  execute(
    page: number,
    limit: number,
    search: string,
    status: string,
    // excludeStatus: string[]
  ): Promise<{
    turfs: Omit<ITurfResponseDTO, "ownerId">[];
    totalPages: number;
  }>;
}
