export interface IHostedGameItem {
  _id: string;

  hostUserId: string;
  turfId: string;
  courtType: string;

  slotDate: string;
  startTime: string;
  endTime: string;

  pricePerPlayer: number;
  capacity: number;

  status: "open" | "full" | "cancelled" | "completed";

  players: {
    userId: string;
    status: "pending" | "paid" | "cancelled";
    joinedAt?: string;

    user?: {
      name: string;
      email: string;
      phoneNumber?: string;
    } | null;
  }[];

  turf?: {
    turfName: string;
    location: {
      address: string;
      city: string;
      state?: string;
    };
    images: string[];
  } | null;

  hostUser?: {
    name: string;
    email: string;
    phoneNumber?: string;
  } | null;

  createdAt: string;
  updatedAt: string;
}
