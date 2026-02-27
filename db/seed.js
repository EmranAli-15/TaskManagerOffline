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

  console.log("from db => ",result)

  if (result?.count === 0) {
    await db.runAsync(`
      INSERT INTO color (head, body) VALUES
      ('#77BEF0', '#CBDCEB'),
      ('#ffdc75', '#fff2cc'),
      ('#eca3a3', '#f6d6d6'),
      ('#a5d732', '#ddf0b2'),
      ('#d94c9f', '#f4cce3'),
      ('#875ab2', '#d2c1e2'),
      ('#FF5F00', '#FF8C00');
    `);
  }
};
