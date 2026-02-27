import * as SQLite from "expo-sqlite";


// DATABASE OPEN ===========================================
const DB_NAME = "taskManager"
let db = null;
const initDB = async () => {
    if (!db) db = await SQLite.openDatabaseAsync(DB_NAME);
    return db;
};

// DATABASE OPEN END ===========================================







// FOR NOTES TABLE ===========================================
export const createNoteTable = async () => {
    const db = await initDB();
    await db.execAsync(`
        CREATE TABLE note (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255),
        details text,
        category_id INTEGER,
        color_id INTEGER,
        FOREIGN KEY (color_id) REFERENCES color(id),
        FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
    );
        `);
};

export const insertDataIntoNoteTable = async ({ title, details, category, color }) => {
    await db.runAsync(`
        INSERT INTO note (title, details, category, color)
        VALUES (?, ?, ?, ?)
     `,
        [title, details, category, color]
    );
};

export const getAllDataFromNoteTable = async () => {
    const db = await initDB();
    const data = await db.getAllAsync(`SELECT note.id, color.head, color.body, title FROM note JOIN color ON note.color = color.id ORDER BY note.id DESC;`);
    return data
};

export const getSingleNoteFromNoteTable = async (id) => {
    const db = await initDB();
    const data = await db.getFirstAsync(`
        SELECT note.id AS noteId, title, details, category.id As categoryId, color.id AS colorId FROM note
        INNER JOIN category
        ON note.category = category.id
        INNER JOIN color
        ON note.color = color.id
        WHERE note.id=${id}
        `);
    return data;
};

export const updateANoteIntoNoteTable = async ({ title, details, color, category, id }) => {
    const db = await initDB();
    await db.runAsync(`
        UPDATE note
        SET title=?, details=?, color=?, category=?
        WHERE id=?
        `,
        [title, details, color, category, id]
    )
}

export const getCategoryDataFromNoteTable = async (category) => {
    const db = await initDB();
    const data = await db.getAllAsync(`SELECT note.id, color.head, color.body, title FROM note JOIN color ON note.color = color.id WHERE category=${category} ORDER BY note.id DESC`);
    return data;
};

export const deleteNoteFromNoteTable = async (id) => {
    const db = await initDB();
    await db.runAsync(`
        DELETE FROM note WHERE id=?
        `,
        [id]
    )
}
// FOR NOTES TABLE ===========================================






// FOR COLOR TABLE ============================================
export const createColorTable = async () => {
    const db = await initDB();
    await db.execAsync(`
        CREATE TABLE color (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        head VARCHAR(15),
        body VARCHAR(15)
    );
        `);
};

export const insertDataIntoColorTable = async () => {
    const db = await initDB();
    const existing = await db.getAllAsync(`SELECT * FROM color;`);

    if (existing.length === 0) {
        await db.runAsync(`
      INSERT INTO color (head, body)
      VALUES
      ('#77BEF0', '#CBDCEB'),
      ('#ffdc75', '#fff2cc'),
      ('#eca3a3', '#f6d6d6'),
      ('#a5d732', '#ddf0b2'),
      ('#d94c9f', '#f4cce3'),
      ('#875ab2', '#d2c1e2');
    `);
    }
};

export const getDataFromColorTable = async () => {
    const db = await initDB();
    const data = await db.getAllAsync(`SELECT * FROM color;`);
    return data;
};
// FOR COLOR TABLE ============================================






// FOR CATEGORY TABLE ======================================
export const createCategoryTable = async () => {
    const db = await initDB();
    await db.execAsync(`
        CREATE TABLE category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(15)
    );
        `);
};

export const insertDataIntoCategoryTable = async () => {
    const db = await initDB();
    const existing = await db.getAllAsync(`SELECT * FROM category;`);
    if (existing.length === 0) {
        await db.runAsync(`
        INSERT INTO category (name)
        VALUES
        ('today'),
        ('exams'),
        ('tasks'),
        ('projects'),
        ('ideas');
        `);
    }
};

export const getDataFromCategoryTable = async () => {
    const db = await initDB();
    const data = await db.getAllAsync(`SELECT * FROM category;`);
    return data;
};
// FOR CATEGORY TABLE ======================================












// 🚫VERY SENSETIVE -> IT'S FOR DELETE THE ENTIRE DATABASE
export const closeDBOld = async () => {
    if (db) {
        await db.closeAsync();
        db = null;
    }
};
export const deleteDBOld = async () => {
    await closeDBOld();
    try {
        await SQLite.deleteDatabaseAsync(DB_NAME);
    } catch (err) {
    }
};
// 🚫VERY SENSETIVE -> IT'S FOR DELETE THE ENTIRE DATABASE