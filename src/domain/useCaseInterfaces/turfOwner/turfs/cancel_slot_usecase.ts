export interface ICancelSlotUseCase{
    execute(data:{turfId:string;date:string;startTime:string;endTime:string}):Promise<void>
}