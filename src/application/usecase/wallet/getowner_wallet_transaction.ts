import { inject, injectable } from "tsyringe";
import { IGetOwnerWalletTransactionsUseCase } from "../../../domain/useCaseInterfaces/wallet/get_owner_wallet_transaction_history";
import { IOwnerWalletTransactionRepository } from "../../../domain/repositoryInterface/wallet/owner_wallet_transactionRepository_interface";
import { IGetOwnerWalletTransactionEntity } from "../../../domain/models/getownerWalletTransaction_entity";
import { mapOwnerWalletTransaction } from "../../mappers/ownerwalletTransactionMappers";

@injectable()
export class GetOwnerWalletTransactionUseCase implements IGetOwnerWalletTransactionsUseCase{
    constructor(
        @inject("IOwnerWalletTransactionRepository")
        private _ownerWalletTransactionRepo:IOwnerWalletTransactionRepository
    ){}

    async execute(ownerId: string, page: number, limit: number): Promise<{ transactions: IGetOwnerWalletTransactionEntity[]; total: number; page: number; limit: number; totalPages: number; }> {
        const currentPage =Math.max(page,1)
        const currentLimit=Math.max(limit,1)
        console.log('ownerIdd',ownerId)

        const {transactions,total} =await this._ownerWalletTransactionRepo.findByOwnerId(
            ownerId,
            currentPage,
            currentLimit
        )
        console.log('transaction','total',transactions,total)

        const mappedTransactions=transactions.map(mapOwnerWalletTransaction)

        return {
            transactions:mappedTransactions,
            total,
            page:currentPage,
            limit:currentLimit,
            totalPages:Math.ceil(total/currentLimit)
        }
    }
}