export function up(knex) { return knex.schema.createTable("tags", table => {
  table.increments("id");
  table.text("name");
  table.integer("user_id").references("id").inTable("users");
  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
});   }

export function down(knex) { return knex.schema.dropTable("tags"); }