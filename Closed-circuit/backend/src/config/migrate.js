import { config } from './env.js';
import { TABLE_DEFINITIONS } from './schema.js';

async function getExistingColumns(pool, tableName) {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
     ORDER BY ORDINAL_POSITION`,
    [config.db.database, tableName]
  );
  return new Set(rows.map((row) => row.COLUMN_NAME));
}

async function indexExists(pool, tableName, indexName) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [config.db.database, tableName, indexName]
  );
  return rows[0]?.total > 0;
}

export async function runSafeMigrations(pool) {
  let columnsAdded = 0;

  for (const [tableName, definition] of Object.entries(TABLE_DEFINITIONS)) {
    await pool.query(definition.createSql);

    const existingColumns = await getExistingColumns(pool, tableName);

    for (const column of definition.columns) {
      if (column.name === 'id' || existingColumns.has(column.name)) {
        continue;
      }

      await pool.query(
        `ALTER TABLE \`${tableName}\` ADD COLUMN \`${column.name}\` ${column.definition}`
      );
      columnsAdded += 1;
      console.log(`  ↳ Added column ${tableName}.${column.name}`);
    }

    if (definition.postMigrate) {
      await definition.postMigrate(pool);
    }

    if (definition.indexes) {
      for (const index of definition.indexes) {
        if (!(await indexExists(pool, tableName, index.name))) {
          await pool.query(
            `CREATE INDEX \`${index.name}\` ON \`${tableName}\` (${index.columns})`
          );
          console.log(`  ↳ Added index ${tableName}.${index.name}`);
        }
      }
    }
  }

  return columnsAdded;
}
