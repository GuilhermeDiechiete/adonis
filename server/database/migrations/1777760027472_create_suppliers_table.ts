import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'suppliers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.enu('transaction_type', ['inputs', 'outputs', 'investments']).notNullable()
      table.enum('type', ['PF', 'PJ']).notNullable()

      table.string('company_name').notNullable()
      table.string('trade_name').notNullable()

      table.string('document').notNullable()
      table.string('email')
      table.string('phone')

      // endereço
      table.string('zip_code')
      table.string('street')
      table.string('number')
      table.string('city')
      table.string('state')
      table.string('country').defaultTo('Brasil')

      table.string('pix_key')
      table.string('bank')
      table.string('agency')
      table.string('account')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}