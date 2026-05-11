import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare group_id: number

  @column()
  declare userId: number

  @column()
  declare type: 'inputs' | 'outputs'

  @column.date()
  declare date: DateTime

  @column()
  declare description: string

  @column()
  declare category: string

  @column()
  declare supplier: string

  @column()
  declare payment: string

  @column()
  declare current_installment: number

  @column()
  declare total_installment: number

  @column()
  declare status: 'paid' | 'pending'

  @column()
  declare amount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}