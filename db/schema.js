import { initDB } from './db';

export const createTables = async () => {
  const db = await initDB();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS color (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      head TEXT,
      body TEXT
    );

    CREATE TABLE IF NOT EXISTS note (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      details TEXT,
      category_id INTEGER,
      color_id INTEGER,

      FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,

      FOREIGN KEY (color_id) REFERENCES color(id)
    );
  `);
};
