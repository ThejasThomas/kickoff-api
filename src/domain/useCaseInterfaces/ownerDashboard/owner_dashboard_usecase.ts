export interface IGetOwnerDashboardUseCase {
  execute(
    ownerId: string,
    options?: {
      dailyDays?: number; 
    }
  ): Promise<{
    overview: {
      totalBookings: number;
      totalRevenue: number;
      totalHostedGames: number;
      totalHostedRevenue: number;
      totalPlayers: number;
    };

    perTurf: {
      turfId: string;
      turfName: string;
      totalBookings: number;
      totalRevenue: number;
    }[];

    bookings: {
      daily: {
        date: string;
        bookings: number;
        revenue: number;
      }[];
      monthly: {
        month: string;
        bookings: number;
        revenue: number;
      }[];
      yearly: {
        year: number;
        bookings: number;
        revenue: number;
      }[];
    };

    hostedGames: {
      overview: {
        totalGames: number;
        completedGames: number;
        cancelledGames: number;
        totalPlayers: number;
        totalRevenue: number;
      };
      daily: {
        date: string;
        games: number;
        players: number;
        revenue: number;
      }[];
      monthly: {
        month: string;
        games: number;
        players: number;
        revenue: number;
      }[];
      yearly: {
        year: number;
        games: number;
        players: number;
        revenue: number;
      }[];
    };
  }>;
}
