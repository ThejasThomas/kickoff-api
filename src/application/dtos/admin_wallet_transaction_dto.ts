
import { IAdminWalletTransactionEntity } from "../../domain/models/admin_wallet_transaction_entity";

export interface IAdminWalletTransactionDTO {
  transactions: IAdminWalletTransactionEntity[];
  total: number;
  page: number;
  totalPages: number;
}
