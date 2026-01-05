export interface IReleaseSlotUsecase {
  execute(
    turfId: string,
    date: string,
    startTime: string,
    endTime: string,
    userId: string
  ): Promise<void>;
}
