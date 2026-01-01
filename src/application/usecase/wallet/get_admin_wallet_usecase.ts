import { inject, injectable } from "tsyringe";
import { IAdminWalletRepository } from "../../../domain/repositoryInterface/wallet/admin_wallet_repository_interface";
import { IGetAdminWalletUseCase } from "../../../domain/useCaseInterfaces/wallet/get_admin_wallet_usecase_interface";
import { IAdminWalletEntity } from "../../../domain/models/admin_wallet_entity";

@injectable()
export class GetAdminWalletUseCase implements IGetAdminWalletUseCase {
    constructor(
        @inject("IAdminWalletRepository")
        private _walletRepo:IAdminWalletRepository
    ){}

    async execute(): Promise<IAdminWalletEntity> {
        return await this._walletRepo.getWallet()
        console.log('calllled')
    }
}