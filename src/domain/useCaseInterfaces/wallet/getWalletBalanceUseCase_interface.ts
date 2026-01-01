export interface IGetWalletBalanceUseCase{
    execute(userId:string):Promise<number>
}