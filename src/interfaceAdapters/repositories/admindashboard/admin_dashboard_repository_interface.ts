import { RevenuePeriod } from "../../../domain/models/AdminDashboardEntity";
import { IAdminDashboardRepository } from "../../../domain/repositoryInterface/admindashboard/admin_dashboard_repository_interface";
import { BookinModel } from "../../database/mongoDb/models/booking_model";
import { ClientModel } from "../../database/mongoDb/models/client_model";
import { TurfModel } from "../../database/mongoDb/models/turf_model";
import { TurfOwnerModel } from "../../database/mongoDb/models/turfOwner_model";
import { AdminWalletModel } from "../../database/mongoDb/schemas/admin_wallet_schema";
import { AdminWalletTransactionModel } from "../../database/mongoDb/schemas/admin_wallet_transaction_schema";

export class AdminDashboardRepository implements IAdminDashboardRepository {
  async getUsersStats(): Promise<{
    total: number;
    active: number;
    blocked: number;
    pending: number;
  }> {
    const [total, active, blocked, pending] = await Promise.all([
      ClientModel.countDocuments(),
      ClientModel.countDocuments({ status: "active" }),
      ClientModel.countDocuments({ status: "blocked" }),
      ClientModel.countDocuments({ status: "pending" }),
    ]);

    return { total, active, blocked, pending };
  }
  async getTurfStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  }> {
    const [total, approved, pending, rejected] = await Promise.all([
      TurfModel.countDocuments(),
      TurfModel.countDocuments({ status: "approved" }),
      TurfModel.countDocuments({ status: "pending" }),
      TurfModel.countDocuments({ status: "rejected" }),
    ]);
    return { total, approved, pending, rejected };
  }
  async getOwnerStats(): Promise<{
    total: number;
    active: number;
    blocked: number;
    pending: number;
  }> {
    const [total, active, blocked, pending] = await Promise.all([
      TurfOwnerModel.countDocuments(),
      TurfOwnerModel.countDocuments({ status: "approved" }),
      TurfOwnerModel.countDocuments({ status: "blocked" }),
      TurfOwnerModel.countDocuments({ status: "pending" }),
    ]);
    return { total, active, blocked, pending };
  }

  async getBookingStats(): Promise<{
    total: number;
    completed: number;
    confirmed: number;
    cancelled:number;
  }> {
    const [total, completed, confirmed,cancelled] = await Promise.all([
      BookinModel.countDocuments(),
      BookinModel.countDocuments({ status: "completed" }),
      BookinModel.countDocuments({ status: "confirmed" }),
      BookinModel.countDocuments({ status: "cancelled" }),

    ]);
    return { total, completed, confirmed,cancelled };
  }
  async getRevenueAnalytics(
    period: RevenuePeriod
  ): Promise<{
    totalBalance: number;
    data: { label: string; amount: number }[];
  }> {
    const wallet = await AdminWalletModel.findOne();
    const totalBalance = wallet?.balance ?? 0;

    const groupStage = this.getGroupStage(period);

    const revenue = await AdminWalletTransactionModel.aggregate([
      { $match: { type: "CREDIT" } },
      {
        $group: {
          _id: groupStage,
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.label": 1 } },
    ]);
    return {
      totalBalance,
      data: revenue.map((r) => ({
        label: r._id.label,
        amount: r.amount,
      })),
    };
  }
  private getGroupStage(period: RevenuePeriod) {
    switch (period) {
      case "daily":
        return {
          label: {
            $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" },
          },
        };

      case "weekly":
        return {
          label: {
            $concat: [
              { $toString: { $isoWeekYear: "$transactionDate" } },
              "-W",
              { $toString: { $isoWeek: "$transactionDate" } },
            ],
          },
        };

      case "monthly":
        return {
          label: {
            $dateToString: { format: "%Y-%m", date: "$transactionDate" },
          },
        };

      case "yearly":
        return {
          label: {
            $dateToString: { format: "%Y", date: "$transactionDate" },
          },
        };
    }
  }
}
