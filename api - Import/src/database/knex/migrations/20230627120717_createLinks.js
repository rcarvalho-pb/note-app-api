export function up(knex) { return knex.schema.createTable("links", table => {
  table.increments("id");
  table.text("url").notNullable();
  table.timestamp("created_at").default(knex.fn.now());
  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
});   }

export function down(knex) { return knex.schema.dropTable("links"); }