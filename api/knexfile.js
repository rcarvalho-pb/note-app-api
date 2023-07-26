const path = require("path");

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run("pragma foreign_keys = on", cb)
        conn.run("pragma case_sensitive_like=OFF", cb)
      }
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    }
  }
};
