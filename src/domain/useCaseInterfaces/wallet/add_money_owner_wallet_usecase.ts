export interface IAddMoneyOwnerWalletUseCase{
    execute(bookingId:string):Promise<void>
}