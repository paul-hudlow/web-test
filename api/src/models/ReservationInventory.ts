import {
  BelongsTo,
    Column,
    CreatedAt,
    DeletedAt,
    Model,
    PrimaryKey, Table,
    UpdatedAt
  } from 'sequelize-typescript'
import { Restaurant } from '.'
  
  @Table({ tableName: 'reservation_inventory' })
  export class ReservationInventory extends Model<ReservationInventory> {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number
  
    @BelongsTo(() => Restaurant, {
      foreignKey: 'restaurantId',
      as: 'restaurantIdAlias'
    })
    @Column
    restaurantId: number
  
    @Column
    timeSlot: string

    @Column
    minGuests: number

    @Column
    maxGuests: number

    @Column
    capacity: number
  
    @DeletedAt
    deleted_at: string
  
    @CreatedAt
    created_at: string
  
    @UpdatedAt
    updated_at: string
  }
  