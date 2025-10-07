export interface AddTurfDTO {
  ownerId: string;
  turfName: string;
  description: string;
  location: {
    address: string;
    city: string;
    state?: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
  };

  amenities: string[];
  images: string[];
  contactNumber: string;
  status: "active" | "inactive" | "approved" | "rejected"|"pending"| "blocked"
  createdAt?: Date;
  updatedAt?: Date;
  pricePerHour: number;
  courtType: string;
  openingTime?:string;
  closingTime?:string;
  slotDuration?:number;

}