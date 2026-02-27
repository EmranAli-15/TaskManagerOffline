// import { closeDBOld, deleteDBOld } from './Database';
// import { closeDB, deleteDB } from './db';
import { createTables } from './schema';
import { seedCategoryTable, seedColorTable } from './seed';

export const prepareDatabase = async () => {
  // await closeDBOld();
  // await deleteDBOld();
  // await closeDB();
  // await deleteDB();
  await createTables();
  await seedCategoryTable();
  await seedColorTable();
};
