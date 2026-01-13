import { RevenuePeriod, RevenuePoint } from "../../domain/models/AdminDashboardEntity";

export interface AdminDashboardResponseDTO {
  users: {
    total: number;
    active: number;
    blocked: number;
    pending: number;
  };

  turfs: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };

  owners: {
    total: number;
    active: number;
    blocked: number;
    pending: number;
  };

  bookings: {
    total: number;
    completed: number;
    confirmed: number;
    cancelled:number;
  };

  revenue: {
    totalBalance: number;
    period: RevenuePeriod;
    data: RevenuePoint[];
  };
}
