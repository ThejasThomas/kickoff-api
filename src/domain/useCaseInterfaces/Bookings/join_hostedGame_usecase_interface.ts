export interface IJoinHostedGameUseCase {
  execute(data: { gameId: string; userId: string }): Promise<{
    success: boolean;
    message: string;
  }>;
}
