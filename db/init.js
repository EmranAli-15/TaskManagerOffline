import { createTables } from './schema';
import { seedCategoryTable, seedColorTable } from './seed';

export const prepareDatabase = async () => {
  await createTables();
  await seedCategoryTable();
  await seedColorTable();
};
