
export interface IAddMoneyUseCase{
    execute(userId:string,amount:number,reason:string):Promise<{success:boolean,balance:number}>
}