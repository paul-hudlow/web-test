import { Op, Sequelize } from "sequelize";
import { Reservation, ReservationInventory } from "../models";

export class AddReservation {

  private database: Sequelize;
  constructor(db: Sequelize) {
    this.database = db;
  }

  public async execute(data: Reservation): Promise<boolean> {
    return this.database.transaction<boolean>(async (transaction) => {
      const inventory = await ReservationInventory.findOne({
        where: {
          timeSlot: data.timeSlot,
          restaurantId: data.restaurantId,
          maxGuests: {
            [Op.gte]: data.guestCount
          },
          minGuests: {
            [Op.lte]: data.guestCount
          }
        },
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      if (!inventory) {
        throw new Error('No reservation capacity.');
      }
      const existing = await Reservation.findAll({
        where: {
          timeSlot: data.timeSlot,
          restaurantId: data.restaurantId,
          guestCount: {
            [Op.gte]: inventory.minGuests,
            [Op.lte]: inventory.maxGuests
          }
        },
        transaction
      });
      if (existing.length >= inventory.capacity) {
        throw new Error('Reservation capacity reached.');
      }
      return await Reservation.upsert(data, {
        transaction
      });
    });
  }
}