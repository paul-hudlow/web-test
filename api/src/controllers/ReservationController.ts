import { Controller, Delete, Get, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { Reservation } from '../models/Reservation';
import { AddReservation } from '../mutations/AddReservation';

@Controller('reservations')
export class ReservationController {

  private database: Sequelize;
  constructor(db: Sequelize) {
    this.database = db;
  }

  @Get('')
  private async list(req: Request, response: Response) {
    const restaurantId = req.query.restaurant;
    try {
      const results = await Reservation.findAll({
        where: restaurantId ? {
          restaurantId
        } : null
      });
      response.status(200).send({
        reservations: results
      });
    } catch (e) {
      response.status(500).send({
        message: e.message
      });
    }
  }

  @Put('')
  private async put(req: Request, response: Response) {
    const entry = {
      restaurantId: req.body.restaurantId,
      timeSlot: req.body.timeSlot,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      guestCount: req.body.guestCount
    } as Reservation;
    try {
      const success = await new AddReservation(this.database).execute(entry);
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
      const reservation = await Reservation.findByPk(id);
      if (reservation) {
        response.status(200).send({
          reservation
        });
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
    const id = req.params.id;
    try {
      const reservation: Reservation = await Reservation.findByPk(parseInt(id));
      if (reservation) {
          reservation.destroy();
          reservation.save();
          response.status(200).send({ success: true });
      } else {
        response.sendStatus(404);
      }
    } catch (e) {
      response.status(500).send({
        message: e.message
      });
    }
  }

}
