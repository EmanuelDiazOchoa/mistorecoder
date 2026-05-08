import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('session.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY NOT NULL,
        email TEXT,
        uid TEXT
      );
    `);
  }
  return db;
};

export const saveSession = async (email: string, uid: string): Promise<void> => {
  const database = await getDb();
  await database.runAsync('DELETE FROM session;');
  await database.runAsync(
    'INSERT INTO session (email, uid) VALUES (?, ?);',
    [email, uid]
  );
};

export const getSession = async (): Promise<{ email: string; uid: string } | null> => {
  const database = await getDb();
  const result = await database.getFirstAsync<{ email: string; uid: string }>(
    'SELECT * FROM session LIMIT 1;'
  );
  return result ?? null;
};

export const clearSession = async (): Promise<void> => {
  const database = await getDb();
  await database.runAsync('DELETE FROM session;');
};