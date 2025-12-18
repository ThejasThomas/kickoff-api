export interface IOwnerDashboardRepository {
  getOwnerOverview(ownerId: string): Promise<{
    totalBookings: number;
    totalRevenue: number;
  }>;

  getPerTurfStats(ownerId: string): Promise<{
    turfId: string;
    turfName: string;
    totalBookings: number;
    totalRevenue: number;
  }[]>;

  getDailyStats(
    ownerId: string,
    days: number
  ): Promise<
    {
      date: string;
      bookings: number;
      revenue: number;
    }[]
  >;

  getMonthlyStats(ownerId: string): Promise<
    {
      month: string;
      bookings: number;
      revenue: number;
    }[]
  >;

  getYearlyStats(ownerId: string): Promise<
    {
      year: number;
      bookings: number;
      revenue: number;
    }[]
  >;
  getHostedGamesOverview(ownerId: string): Promise<{
  totalGames: number;
  completedGames: number;
  cancelledGames: number;
  totalPlayers: number;
  totalRevenue: number;
}>;

getHostedGamesDailyStats(
  ownerId: string,
  days: number
): Promise<
  {
    date: string;
    games: number;
    players: number;
    revenue: number;
  }[]
>;

getHostedGamesMonthlyStats(ownerId: string): Promise<
  {
    month: string;
    games: number;
    players: number;
    revenue: number;
  }[]
>;

getHostedGamesYearlyStats(ownerId: string): Promise<
  {
    year: number;
    games: number;
    players: number;
    revenue: number;
  }[]
>;

}

