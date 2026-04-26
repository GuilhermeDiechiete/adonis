import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('role').notNullable().defaultTo('user')
      table.boolean('is_active').notNullable().defaultTo(true)

      table.string('full_name').nullable()
      table.string('username').notNullable().unique()
      table.date('birth').nullable()
      table.string('phone').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      
      // Endereço
      table.string('street')       // Rua
      table.string('number')      // Número
      table.string('zip_code', 20)  // CEP
      table.string('city')         // Cidade
      table.string('state', 100)   // Estado
      table.string('country', 100).defaultTo('Brasil')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
