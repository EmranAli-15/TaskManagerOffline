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
      ('#77BEF0', '#FFCB61'),
      ('#FE5D26', '#F2C078'),
      ('#16C47F', '#FFD65A'),
      ('#5DD3B6', '#6E5034'),
      ('#124076', '#7F9F80'),
      ('#FF7F11', '#ACBFA4'),
      ('#6E026F', '#ABDADC');
    `);
  }
};
