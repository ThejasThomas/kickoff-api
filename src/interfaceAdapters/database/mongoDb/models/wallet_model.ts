import { model } from "mongoose";
import { IWalletEntity } from "../../../../domain/models/wallet_entity";
import { WalletSchema } from "../schemas/wallet_schema";

 export interface IWallet extends IWalletEntity{

 }

 export const WalletModel=model<IWallet>('Wallet',WalletSchema)