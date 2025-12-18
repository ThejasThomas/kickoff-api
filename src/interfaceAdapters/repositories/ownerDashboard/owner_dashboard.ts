import { injectable } from "tsyringe";
import { IOwnerDashboardRepository } from "../../../domain/repositoryInterface/ownerDashboard/owner_dashboard_repository_interface";
import { TurfModel } from "../../database/mongoDb/models/turf_model";
import { BookinModel } from "../../database/mongoDb/models/booking_model";
import { HostedGameModel } from "../../database/mongoDb/schemas/hosted_game_schema";

@injectable()
export class OwnerDashboardRepository implements IOwnerDashboardRepository {
  private async getOwnerTurfIds(ownerId: string) {
    const turfs = await TurfModel.find(
      { ownerId },
      { _id: 1, turfName: 1 }
    ).lean();

    return {
      turfIds: turfs.map((t) => t._id.toString()),
      turfs,
    };
  }

  async getOwnerOverview(
    ownerId: string
  ): Promise<{ totalBookings: number; totalRevenue: number }> {
    const { turfIds } = await this.getOwnerTurfIds(ownerId);

    const result = await BookinModel.aggregate([
      {
        $match: {
          turfId: { $in: turfIds },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    return {
      totalBookings: result[0]?.totalBookings || 0,
      totalRevenue: result[0]?.totalRevenue || 0,
    };
  }

  async getPerTurfStats(
    ownerId: string
  ): Promise<
    {
      turfId: string;
      turfName: string;
      totalBookings: number;
      totalRevenue: number;
    }[]
  > {
    const { turfIds, turfs } = await this.getOwnerTurfIds(ownerId);
    const stats = await BookinModel.aggregate([
      {
        $match: {
          turfId: { $in: turfIds },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: "$turfId",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    return stats.map((item) => {
      const turf = turfs.find((t) => t._id.toString() === item._id);

      return {
        turfId: item._id,
        turfName: turf?.turfName || "Unknown",
        totalBookings: item.totalBookings,
        totalRevenue: item.totalRevenue,
      };
    });
  }

  async getDailyStats(
    ownerId: string,
    days: number
  ): Promise<{ date: string; bookings: number; revenue: number }[]> {
    const { turfIds } = await this.getOwnerTurfIds(ownerId);

    return BookinModel.aggregate([
      {
        $match: {
          turfId: { $in: turfIds },
          paymentStatus: "completed",
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - days)),
          },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
          },
          bookings: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]).then((res) =>
      res.map((r) => ({
        date: r._id.date,
        bookings: r.bookings,
        revenue: r.revenue,
      }))
    );
  }

  async getMonthlyStats(
    ownerId: string
  ): Promise<{ month: string; bookings: number; revenue: number }[]> {
    const { turfIds } = await this.getOwnerTurfIds(ownerId);

    return BookinModel.aggregate([
      {
        $match: {
          turfId: { $in: turfIds },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: {
            month: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt",
              },
            },
          },
          bookings: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]).then((res) =>
      res.map((r) => ({
        month: r._id.month,
        bookings: r.bookings,
        revenue: r.revenue,
      }))
    );
  }

  async getYearlyStats(
    ownerId: string
  ): Promise<{ year: number; bookings: number; revenue: number }[]> {
    const { turfIds } = await this.getOwnerTurfIds(ownerId);

    return BookinModel.aggregate([
      {
        $match: {
          turfId: { $in: turfIds },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          bookings: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
      { $sort: { "_id.year": 1 } },
    ]).then((res) =>
      res.map((r) => ({
        year: r._id.year,
        bookings: r.bookings,
        revenue: r.revenue,
      }))
    );
  }

  async getHostedGamesOverview(
    ownerId: string
  ): Promise<{
    totalGames: number;
    completedGames: number;
    cancelledGames: number;
    totalPlayers: number;
    totalRevenue: number;
  }> {
    const {turfIds}=await this.getOwnerTurfIds(ownerId)
    const result = await HostedGameModel.aggregate([
      { $match: { turfId:{$in:turfIds}  } },

      {
        $project: {
          status: 1,
          paidPlayers: {
            $filter: {
              input: "$players",
              as: "player",
              cond: { $eq: ["$$player.status", "paid"] },
            },
          },
          pricePerPlayer: 1,
        },
      },

      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          completedGames: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          cancelledGames: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
            },
          },
          totalPlayers: { $sum: { $size: "$paidPlayers" } },
          totalRevenue: {
            $sum: {
              $multiply: [{ $size: "$paidPlayers" }, "$pricePerPlayer"],
            },
          },
        },
      },
    ]);

    return {
      totalGames: result[0]?.totalGames || 0,
      completedGames: result[0]?.completedGames || 0,
      cancelledGames: result[0]?.cancelledGames || 0,
      totalPlayers: result[0]?.totalPlayers || 0,
      totalRevenue: result[0]?.totalRevenue || 0,
    };
  }

  async getHostedGamesDailyStats(
    ownerId: string,
    days: number
  ): Promise<
    { date: string; games: number; players: number; revenue: number }[]
  > {
    const {turfIds}=await this.getOwnerTurfIds(ownerId)
    return HostedGameModel.aggregate([
      {
        $match: {
          turfId: { $in: turfIds },
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - days)),
          },
        },
      },

      {
        $project: {
          createdAt: 1,
          paidPlayers: {
            $filter: {
              input: "$players",
              as: "player",
              cond: { $eq: ["$$player.status", "paid"] },
            },
          },
          pricePerPlayer: 1,
        },
      },

      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
          },
          games: { $sum: 1 },
          players: { $sum: { $size: "$paidPlayers" } },
          revenue: {
            $sum: {
              $multiply: [{ $size: "$paidPlayers" }, "$pricePerPlayer"],
            },
          },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]).then((res) =>
      res.map((r) => ({
        date: r._id.date,
        games: r.games,
        players: r.players,
        revenue: r.revenue,
      }))
    );
  }
  async getHostedGamesMonthlyStats(
    ownerId: string
  ): Promise<
    { month: string; games: number; players: number; revenue: number }[]
  > {
        const {turfIds}=await this.getOwnerTurfIds(ownerId)

    return HostedGameModel.aggregate([
      { $match: { turfId: { $in: turfIds } } },

      {
        $project: {
          createdAt: 1,
          paidPlayers: {
            $filter: {
              input: "$players",
              as: "player",
              cond: { $eq: ["$$player.status", "paid"] },
            },
          },
          pricePerPlayer: 1,
        },
      },

      {
        $group: {
          _id: {
            month: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt",
              },
            },
          },
          games: { $sum: 1 },
          players: { $sum: { $size: "$paidPlayers" } },
          revenue: {
            $sum: {
              $multiply: [{ $size: "$paidPlayers" }, "$pricePerPlayer"],
            },
          },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]).then((res) =>
      res.map((r) => ({
        month: r._id.month,
        games: r.games,
        players: r.players,
        revenue: r.revenue,
      }))
    );
  }
  async getHostedGamesYearlyStats(
    ownerId: string
  ): Promise<
    { year: number; games: number; players: number; revenue: number }[]
  > {
            const {turfIds}=await this.getOwnerTurfIds(ownerId)

    return HostedGameModel.aggregate([
      { $match: { turfId: { $in: turfIds } } },

      {
        $project: {
          createdAt: 1,
          paidPlayers: {
            $filter: {
              input: "$players",
              as: "player",
              cond: { $eq: ["$$player.status", "paid"] },
            },
          },
          pricePerPlayer: 1,
        },
      },

      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          games: { $sum: 1 },
          players: { $sum: { $size: "$paidPlayers" } },
          revenue: {
            $sum: {
              $multiply: [{ $size: "$paidPlayers" }, "$pricePerPlayer"],
            },
          },
        },
      },
      { $sort: { "_id.year": 1 } },
    ]).then((res) =>
      res.map((r) => ({
        year: r._id.year,
        games: r.games,
        players: r.players,
        revenue: r.revenue,
      }))
    );
  }
}
