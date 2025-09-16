import * as SQLite from "expo-sqlite";

let db = null;
const initDB = async () => {
    if (!db) db = await SQLite.openDatabaseAsync("taskManager");
    return db;
};




// FOR NOTES TABLE
export const createNoteTable = async () => {
    const db = await initDB();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS note (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255),
        details text,
        category INT,
        color INT
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
    const data = await db.getAllAsync(`SELECT note.id, color.head, color.body, title FROM note JOIN color ON note.color = color.id;`);
    return data;
};

export const getCategoryDataFromNoteTable = async (category) => {
    const db = await initDB();
    const data = await db.getAllAsync(`SELECT * FROM note WHERE category=${category}`);
    return data;
};







// FOR COLOR TABLE
export const createColorTable = async () => {
    const db = await initDB();
    await db.execAsync(`CREATE TABLE IF NOT EXISTS color (id INTEGER PRIMARY KEY AUTOINCREMENT, head VARCHAR(15), body VARCHAR(15));`);
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



// FOR CATEGORY TABLE
export const createCategoryTable = async () => {
    const db = await initDB();
    await db.execAsync(`CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(15));`);
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