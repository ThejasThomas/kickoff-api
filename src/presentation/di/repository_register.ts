import { container } from "tsyringe";
import { IOtpRepository } from "../../domain/repositoryInterface/auth/otp-repository.interface";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp_repository";
import { ClientRepository } from "../../interfaceAdapters/repositories/users/client_repository";
import { TurfOwnerRepository } from "../../interfaceAdapters/repositories/users/turfOwner_Repository";
import { IAdminRepository } from "../../domain/repositoryInterface/users/admin-repository.interface.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/users/admin_repository";
import { IRefreshTokenRepository } from "../../domain/repositoryInterface/auth/refresh-token-repository.interface";
import { RefreshTokenRepository } from "../../interfaceAdapters/repositories/auth/refresh_token_repositories";
import { IRedisTokenRepository } from "../../domain/repositoryInterface/redis/redis_token_repository_interface";
import { RedisTokenRepository } from "../../interfaceAdapters/repositories/redis/redis_token_repository";
import { ITurfRepository } from "../../domain/repositoryInterface/Turf/turf_repository_interface";
import { TurfRepository } from "../../interfaceAdapters/repositories/turf/turf_repository";
export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register('IOtpRepository', {
  useClass: OtpRepository,
});

container.register("IClientRepository",{
    useClass:ClientRepository
})
container.register('ITurfOwnerRepository',{
    useClass:TurfOwnerRepository
})

container.register<IAdminRepository>('IAdminRepository', {
  useClass:AdminRepository
})
container.register<IRefreshTokenRepository>('IRefreshTokenRepository',{
  useClass:RefreshTokenRepository
})
container.register<IRedisTokenRepository>('IRedisTokenRepository',{
  useClass:RedisTokenRepository
})
container.register<ITurfRepository>('ITurfRepository',{
  useClass:TurfRepository
})


  }
}
