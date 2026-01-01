import { injectable } from "tsyringe";
import { IRedisTokenRepository } from "../../../domain/repositoryInterface/redis/redis_token_repository_interface";
import { redisClient } from "../../redis/redis.client";

@injectable()
export class RedisTokenRepository implements IRedisTokenRepository {
    async storeResetToken(userId: string, token: string): Promise<void> {
        const key =`reset_token:${userId}`;
        await redisClient.setEx(key,300,token)
    }
    async verifyResetToken(userId: string, token: string): Promise<boolean> {
    const key = `reset_token:${userId}`;
    const storedToken = await redisClient.get(key);
    return storedToken === token;
  }
  async deleteResetToken(userId: string) {
    const key = `reset_token:${userId}`;
    await redisClient.del(key);
  }
  private buildKey(
    turfId: string,
    date: string,
    startTime: string,
    endTime: string
  ) {
    return `lock:slot:${turfId}:${date}:${startTime}-${endTime}`;
  }
  async aquireLock(turfId: string, date: string, startTime: string, endTime: string, userId: string): Promise<boolean> {
    const key=this.buildKey(turfId,date,startTime,endTime);

    const result = await redisClient.set(
      key,
      userId,
      {
        NX:true,
        EX:600
      }
    )
    return result ==="OK";
  }

  async verifyLock(turfId: string, date: string, startTime: string, endTime: string, userId: string): Promise<boolean> {
    const key =this.buildKey(turfId,date,startTime,endTime);
    const owner = await redisClient.get(key);
    return owner ===userId;
  }

  async releaseLock(turfId: string, date: string, startTime: string, endTime: string, userId: string): Promise<void> {
    const key =this.buildKey(turfId,date,startTime,endTime);
    const owner= await redisClient.get(key)

    if(owner===userId){
      await redisClient.del(key)
    }
  }
  
}