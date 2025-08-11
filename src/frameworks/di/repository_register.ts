import { container } from "tsyringe";
import { IOtpRepository } from "../../entities/repositoryInterface/auth/otp-repository.interface";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp_repository";
import { ClientRepository } from "../../interfaceAdapters/repositories/users/client_repository";
import { TurfOwnerRepository } from "../../interfaceAdapters/repositories/users/turfOwner_Repository";
import { IAdminRepository } from "../../entities/repositoryInterface/users/admin-repository.interface.interface";
import { AdminRepository } from "../../interfaceAdapters/repositories/users/admin_repository";
import { IRefreshTokenRepository } from "../../entities/repositoryInterface/auth/refresh-token-repository.interface";
import { RefreshTokenRepository } from "../../interfaceAdapters/repositories/auth/refresh_token_repositories";
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

  }
}
