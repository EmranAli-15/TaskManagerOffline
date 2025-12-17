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
        ON note.color = color.id
        ORDER BY note.id DESC;
        `);
    return data
};
// ============== END == NOTES TABLE QUERIES == END ================





// ============== NOTES TABLE QUERIES ================
export const getCategories = async () => {
    const db = await initDB();
    const data = await db.getAllAsync(`
        SELECT * FROM category;
        `);
    return data
};
// ============== END == NOTES TABLE QUERIES == END ================