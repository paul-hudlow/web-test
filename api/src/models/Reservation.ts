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
  
  @Table({ tableName: 'reservations' })
  export class Reservation extends Model<Reservation> {
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
    firstName: string

    @Column
    lastName: string

    @Column
    email: string

    @Column
    guestCount: number
  
    @DeletedAt
    deleted_at: string
  
    @CreatedAt
    created_at: string
  
    @UpdatedAt
    updated_at: string
  }
  