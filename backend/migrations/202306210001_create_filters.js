export async function up(knex) {
  return knex.schema.createTable('filters', table => {
    table.increments('id').primary();
    table.string('field');
    table.string('operator');
    table.string('value');
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('filters');
}
