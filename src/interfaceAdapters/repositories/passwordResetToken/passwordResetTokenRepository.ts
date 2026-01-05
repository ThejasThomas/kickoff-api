import { IPasswordResetTokenRepository } from "../../../domain/repositoryInterface/passwordResetToken/password_reset_token_repository";
import { redisClient } from "../../redis/redis.client";

export class PasswordResetTokenRepository implements IPasswordResetTokenRepository{
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
}