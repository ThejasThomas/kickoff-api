import { IRefreshTokenEntity } from "../../models/refreshToken_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IRefreshTokenRepository extends  IBaseRepository<IRefreshTokenEntity> {
    revokeRefreshToken(token:string): Promise<void>;
}
