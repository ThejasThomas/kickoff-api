import { GetTurfDTO } from "../../../../presentation/dtos/get_turf_dto";
import { ITurfEntity } from "../../../models/turf_entity";

export interface IGetMyTurfsUseCase {
  execute(
    ownerId: string,
    page: number,
    limit: number,
    search?: string,
    status?: string
  ): Promise<{ turfs: GetTurfDTO[]; totalPages: number }>;
}
