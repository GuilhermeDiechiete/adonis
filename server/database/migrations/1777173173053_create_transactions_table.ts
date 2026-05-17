import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // id unico da transação

      table.integer('group_id').notNullable() // id do grupo de transações (parcelamento)
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.enu('transaction_type', ['inputs', 'outputs', 'investments']).notNullable()
      table.date('date').notNullable()
      table.string('description').notNullable()
      table.string('category').notNullable().notNullable()
      table.string('category_name').notNullable().notNullable()
      table.string('supplier')
      table.string('payment').notNullable().notNullable()
      table.integer('current_installment').notNullable()
      table.integer('total_installment').notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.string('status').defaultTo('pending')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}