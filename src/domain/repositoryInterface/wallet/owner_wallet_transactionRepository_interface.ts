import { OwnerWalletTransactionDTO } from "../../../application/dtos/ownerwalletTransaction_dto";
import { IOwnerWalletTransactionEntity } from "../../models/ownerWallet_transaction_entity";

export interface IOwnerWalletTransactionRepository{
    create(
        data:IOwnerWalletTransactionEntity
    ):Promise<IOwnerWalletTransactionEntity>

    findByOwnerId(
        ownerId:string,page:number,limit:number
    ):Promise<{transactions:OwnerWalletTransactionDTO[];
        total:number
    }>
    findByOwnerAndTurf(
    ownerId: string,
    turfId: string
  ): Promise<IOwnerWalletTransactionEntity[]>;

}