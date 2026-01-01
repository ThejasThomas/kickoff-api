export interface IRedisTokenRepository {
    storeResetToken(userId: string, token: string): Promise<void>;
    verifyResetToken(userId: string, token: string): Promise<boolean>;
    deleteResetToken(userId: string): Promise<void>;
    aquireLock(turfId:string,date:string,startTime:string,endTime:string,userId:string):Promise<boolean>
    releaseLock(turfId:string,date:string,startTime:string,endTime:string,userId:string):Promise<void>
    verifyLock(turfId:string,date:string,startTime:string,endTime:string,userId:string):Promise<boolean>
}