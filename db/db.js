import * as SQLite from 'expo-sqlite';



// ============== THE MAIN DATABASE ================
const DB_NAME = "taskManager"
let db = null;

export const initDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    // Enable foreign keys (VERY IMPORTANT)
    await db.execAsync(`PRAGMA foreign_keys = ON;`);
  }

  return db;
};
// ============== END == THE MAIN DATABASE == END ================





// ============== NOTES TABLE QUERIES ================
export const getAllDataFromNoteTable = async () => {
  const db = await initDB();
  const data = await db.getAllAsync(`
        SELECT note.id, color.head, color.body, title
        FROM note JOIN color
        ON note.color_id = color.id
        ORDER BY note.id DESC;
        `);
  return data
};


export const getNotesByCategory = async (category_id) => {
  const db = await initDB();
  const data = await db.getAllAsync(`
    SELECT note.id, color.head, color.body, title
      FROM note JOIN color ON note.color_id = color.id 
      WHERE category_id=${category_id} 
      ORDER BY note.id DESC
    `);
  return data;
}
// ============== END == NOTES TABLE QUERIES == END ================





// ============== CATEGORY TABLE QUERIES ================
export const getCategories = async () => {
  const db = await initDB();
  const data = await db.getAllAsync(`
        SELECT * FROM category;
        `);
  return data
};

export const addNewCategory = async ({ name }) => {
  const db = await initDB();

  const res = await db.getAllAsync(`
    SELECT name FROM category
      WHERE name = '${name}';
    `
  );

  if (res.length !== 0) return;

  await db.runAsync(`
        INSERT INTO category (name)
        VALUES (?)
        `,
    [name]
  );
};

export const deleteCategory = async (id) => {
  const db = await initDB();
  await db.runAsync(`
        DELETE FROM category WHERE id = ?
        `,
    [id]
  )
}
// ============== END == CATEGORY TABLE QUERIES == END ================