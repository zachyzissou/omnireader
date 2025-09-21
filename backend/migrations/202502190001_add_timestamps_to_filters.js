export async function up(knex) {
  await knex.schema.alterTable('filters', (table) => {
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.alterTable('filters', (table) => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
}
