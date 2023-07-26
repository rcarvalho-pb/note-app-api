import { dirname, resolve} from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const development = {
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, "src", "database", "database.db")
  },
  pool: {
    afterCreate: (conn, cb) => {
      conn.run("pragma foreign_keys = on", cb);
      conn.run("pragma case_sensitive_like=OFF", cb);
    }
  },
  useNullAsDefault: true,
  migrations: {
    directory: resolve(__dirname, "src", "database", "knex", "migrations")
  }
};
