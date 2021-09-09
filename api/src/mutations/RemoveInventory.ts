import { Op, Sequelize } from "sequelize";
import { Reservation, ReservationInventory } from "../models";

export class RemoveInventory {

  private database: Sequelize;
  constructor(db: Sequelize) {
    this.database = db;
  }

  public async execute(id: number): Promise<boolean> {
    return this.database.transaction<boolean>(async (transaction) => {
      const inventory = await ReservationInventory.findByPk(id, {
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      const existing = await Reservation.findAll({
        where: {
          timeSlot: inventory.timeSlot,
          restaurantId: inventory.restaurantId,
          guestCount: {
            [Op.gte]: inventory.minGuests,
            [Op.lte]: inventory.maxGuests
          }
        },
        transaction
      });
      if (existing.length > 0) {
        throw new Error('Reservations already exist.');
      }
      inventory.destroy({ transaction });
      return await inventory.save({ transaction });
    });
  }
}
