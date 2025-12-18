import { inject, injectable } from "tsyringe";
import { IAdminWalletTransactionUSeCase } from "../../../domain/useCaseInterfaces/wallet/get_admin_wallet_transaction_usecase_interface";
import { IAdminWalletTransactionRepository } from "../../../domain/repositoryInterface/wallet/admin_wallet_transaction_history_interface";
import { IAdminWalletTransactionEntity } from "../../../domain/models/admin_wallet_transaction_entity";
import { IAdminWalletTransactionDTO } from "../../dtos/admin_wallet_transaction_dto";

@injectable()
export class GetAdminWalletTransactionUseCase implements IAdminWalletTransactionUSeCase{
    constructor(
        @inject("IAdminWalletTransactionRepository")
        private _transactionRepo:IAdminWalletTransactionRepository
    ){}
    async execute(page:number,limit:number): Promise<IAdminWalletTransactionDTO> {
        const {transactions,total} =await this._transactionRepo.getPaginated(page,limit)

        return {
            transactions,
            total,
            page,
            totalPages:Math.ceil(total/limit)
        }
    }
}