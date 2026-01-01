export interface CreateHostedGameDTO {
  turfId: string;
  courtType: string;
  slotDate: string;      
  startTime: string;     
  endTime: string;       
  pricePerPlayer: number;
  capacity: number;
}
