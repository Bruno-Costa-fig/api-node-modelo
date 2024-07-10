exports.up = function(knex) {
  return knex.schema.createTable('usuarios', function(table) {
    table.increments('id').primary();
    table.string('nome', 100).notNullable();
    table.string('email', 100).unique().notNullable();
    table.string('senha', 100).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuarios');
};

