import { Controller, Delete, Get, Put } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Sequelize } from 'sequelize';
import { ReservationInventory } from '../models';
import { RemoveInventory } from '../mutations/RemoveInventory';

@Controller('reservation-inventory')
export class ReservationInventoryController {

  private database: Sequelize;
  constructor(db: Sequelize) {
    this.database = db;
  }

  @Get('')
  private async list(req: Request, response: Response) {
    const restaurantId = req.query.restaurant;
    try {
      const results = await ReservationInventory.findAll({
        where: restaurantId ? {
          restaurantId
        } : null
      });
      response.status(200).send({
        inventory: results
      });
    } catch (e) {
      response.status(500).send({
        message: e.message
      });
    }
  }

  @Put('')
  private async put(req: Request, response: Response) {
    try {
      const success = await ReservationInventory.upsert({
        restaurantId: req.body.restaurantId,
        timeSlot: req.body.timeSlot,
        minGuests: req.body.minGuests,
        maxGuests: req.body.maxGuests,
        capacity: req.body.capacity
      } as ReservationInventory);
      response.status(200).send({ success });
      // TODO Consider returning created ID.
    } catch (e) {
      response.status(500).send({
        message: e.message
      });
    }
  }

  @Get(':id')
  private async get(req: Request, response: Response) {
    const id = req.params.id;
    try {
      const inventory = await ReservationInventory.findByPk(id);
      if (inventory) {
        response.status(200).send({ inventory });
      } else {
        response.sendStatus(404);
      }
    } catch (e) {
      response.status(500).send({
        message: e.message
      });
    }
  }

  @Delete(':id')
  private async delete(req: Request, response: Response) {
    try {
      const id = parseInt(req.params.id);
      const inventory: ReservationInventory = await ReservationInventory.findByPk(id);
      if (inventory) {
        const success = await new RemoveInventory(this.database).execute(id);
        response.status(200).send({ success });
      } else {
        response.sendStatus(404);
      }
    } catch (e) {
      response.status(500).send({ message: e.message });
    }
  }

}
