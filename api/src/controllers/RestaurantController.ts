import { Controller, Delete, Get, Patch, Put } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Restaurant } from '../models';

@Controller('restaurants')
export class RestaurantController {

  @Get('')
  private async list(req: Request, response: Response) {
    const results = await Restaurant.findAll();
    response.status(200).send({
      restaurants: results
    });
  }

  @Put('')
  private async put(req: Request, response: Response) {
    const entry = {
      name: req.body.name,
      address: req.body.address
    } as Restaurant;
    try {
      const success = await Restaurant.upsert(entry);
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
      const restaurant = await Restaurant.findByPk(id);
      response.status(200).send({ restaurant });
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
      const restaurant: Restaurant = await Restaurant.findByPk(parseInt(id));
      if (restaurant) {
          restaurant.destroy();
          restaurant.save();
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

  @Patch(':id')
  private async update(req: Request, response: Response) {
    const id = req.params.id;
    try {
      const restaurant: Restaurant = await Restaurant.findByPk(parseInt(id));
      if (restaurant) {
          if (req.body.name) {
              restaurant.set('name', req.body.name);
          }
          if (req.body.address) {
              restaurant.set('address', req.body.address);
          }
          await restaurant.save();
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
