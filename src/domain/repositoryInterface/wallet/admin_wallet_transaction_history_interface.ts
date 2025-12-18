import { IAdminWalletTransactionEntity } from "../../models/admin_wallet_transaction_entity";

export interface IAdminWalletTransactionRepository {
  create(
    data: IAdminWalletTransactionEntity
  ): Promise<IAdminWalletTransactionEntity>;
  getPaginated(page:number,limit:number):Promise<{transactions:IAdminWalletTransactionEntity[];total:number}>
}
