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
export const createNote = async ({ title, details, category, color }) => {
  await db.runAsync(`
        INSERT INTO note (title, details, category_id, color_id)
        VALUES (?, ?, ?, ?)
     `,
    [title, details, category, color]
  );
};

export const getNotesByCategory = async (category_id) => {
  const db = await initDB();

  let data;

  if (category_id == 1) {
    data = await db.getAllAsync(`
        SELECT note.id, color.head, color.body, title, details
        FROM note JOIN color
        ON note.color_id = color.id
        ORDER BY note.id DESC;
        `);
  } else {
    data = await db.getAllAsync(`
      SELECT note.id, color.head, color.body, title, details
        FROM note JOIN color
        ON note.color_id = color.id 
        WHERE category_id=${category_id} 
        ORDER BY note.id DESC
      `);
  }

  return data;
};


export const getSingleNote = async (id) => {
  const db = await initDB();
  const data = await db.getFirstAsync(`
        SELECT note.id AS noteId, title, details, category.id As categoryId, color.id AS colorId FROM note
        INNER JOIN category
        ON note.category_id = category.id
        INNER JOIN color
        ON note.color_id = color.id
        WHERE note.id=${id}
        `);
  return data;
};


export const updateNote = async ({ title, details, color_id, category_id, id }) => {
  const db = await initDB();
  await db.runAsync(`
        UPDATE note
        SET title=?, details=?, color_id=?, category_id=?
        WHERE id=?
        `,
    [title, details, color_id, category_id, id]
  )
};


export const deleteNote = async (id) => {
  const db = await initDB();
  await db.runAsync(`
        DELETE FROM note WHERE id=?
        `,
    [id]
  )
};
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








// ============== COLOR TABLE QUERIES  ================
export const getColors = async () => {
  const db = await initDB();
  const data = await db.getAllAsync(`SELECT * FROM color;`);
  return data;
};
// ============== END == COLOR TABLE QUERIES == END ================












// 🚫VERY SENSETIVE -> IT'S FOR DELETE THE ENTIRE DATABASE
export const closeDB = async () => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};
export const deleteDB = async () => {
  await closeDB();
  try {
    await SQLite.deleteDatabaseAsync(DB_NAME);
  } catch (err) {
  }
};
// 🚫VERY SENSETIVE -> IT'S FOR DELETE THE ENTIRE DATABASE