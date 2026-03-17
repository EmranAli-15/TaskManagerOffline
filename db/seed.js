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
        ('#FF6B81', '#FFE3E8'),
        ('#4D96FF', '#EAF2FF'),
        ('#6BCB77', '#E8F8EC'),
        ('#FFB84C', '#FFF3DA'),
        ('#9D7BFF', '#F1EBFF'),
        ('#26C6DA', '#E0F7FA');
    `);
  }
};
