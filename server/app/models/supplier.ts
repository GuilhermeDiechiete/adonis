import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // 🔗 relacionamento
  @column()
  declare user_id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // 🧾 dados básicos
  @column()
  declare type: 'PF' | 'PJ'

    @column()
  declare transaction_type: 'inputs' | 'outputs'

  @column()
  declare company_name: string

  @column()
  declare trade_name: string

  @column()
  declare document: string

  // 📞 contato
  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  // 📍 endereço
  @column()
  declare zip_code: string | null

  @column()
  declare street: string | null

  @column()
  declare number: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare country: string | null

  // 💰 financeiro
  @column()
  declare pix_key: string | null

  @column()
  declare bank: string | null

  @column()
  declare agency: string | null

  @column()
  declare account: string | null

  // 🕒 timestamps
  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime
}