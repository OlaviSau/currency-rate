const { Database } = require("sqlite3");

const historicalDB = new Database(`${__dirname}/historical.db`);

historicalDB.run(`
    CREATE TABLE IF NOT EXISTS rates (
      "id" integer PRIMARY_KEY,
      "date" text,
      "from" text,
      "to" text,
      "rate" real
    );
  `);

historicalDB.close();

