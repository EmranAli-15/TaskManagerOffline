import { initDB } from './db';

export const seedCategoryTable = async () => {
  const db = await initDB();

  const result = await db.getFirstAsync(
    `SELECT COUNT(*) as count FROM category;`
  );

  if (result?.count === 0) {
    await db.runAsync(`
      INSERT INTO category (name)
      VALUES ('All');
    `);
  }
};

export const seedColorTable = async () => {
  const db = await initDB();

  const result = await db.getFirstAsync(
    `SELECT COUNT(*) as count FROM color;`
  );

  if (result?.count === 0) {
    await db.runAsync(`
      INSERT INTO color (head, body) VALUES
      ('#FE9EC7', '#ffdcff'),
      ('#84B179', '#dfffd3'),
      ('#8E977D', '#faffe7'),
      ('#F68048', '#ffdaa2'),
      ('#756AB6', '#fcf3ff'),
      ('#134686', '#caffff');
    `);
  }
};
