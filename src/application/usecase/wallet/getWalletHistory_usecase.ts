import { inject, injectable } from "tsyringe";
import { IGetWalletHistoryUseCase } from "../../../domain/useCaseInterfaces/wallet/get_walletHistory_usecase";
import { IWalletRepository } from "../../../domain/repositoryInterface/wallet/wallet_repository_interface";
import { IWalletEntity } from "../../../domain/models/wallet_entity";

@injectable()
export class GetWalletHistoryUseCase implements IGetWalletHistoryUseCase {
    constructor(
        @inject("IWalletRepository")
        private _walletRepository:IWalletRepository
    ){}

    async execute(userId: string,page:number,limit:number): Promise<{ transactions: IWalletEntity[]; total: number }> {
        return await this._walletRepository.getTransactionHistory(userId,page,limit)
    }
}