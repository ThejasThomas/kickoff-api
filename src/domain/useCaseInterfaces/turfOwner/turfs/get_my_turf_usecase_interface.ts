import { GetTurfDTO } from "../../../../application/dtos/get_turf_dto";

export interface IGetMyTurfsUseCase {
  execute(
    ownerId: string,
    page: number,
    limit: number,
    search?: string,
    status?: string
  ): Promise<{ turfs: GetTurfDTO[]; totalPages: number }>;
}
