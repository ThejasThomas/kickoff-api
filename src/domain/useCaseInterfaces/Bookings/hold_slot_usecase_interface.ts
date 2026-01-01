export interface IHoldSlotUseCase{
    execute(turfId:string,date:string,startTime:string,endTime:string,userId:string):Promise<{success:boolean}>
}