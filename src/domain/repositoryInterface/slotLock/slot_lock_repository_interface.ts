export interface ISlotLockRepository {
    aquireLock(turfId:string,date:string,startTime:string,endTime:string,userId:string):Promise<boolean>
    releaseLock(turfId:string,date:string,startTime:string,endTime:string,userId:string):Promise<void>
    verifyLock(turfId:string,date:string,startTime:string,endTime:string,userId:string):Promise<boolean>
}